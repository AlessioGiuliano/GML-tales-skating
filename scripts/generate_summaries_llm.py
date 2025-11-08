import argparse
import json
import logging
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Sequence

from langchain_openai import ChatOpenAI

import llm_calling.generate_competition_summary as competition_summary
import llm_calling.generate_race_description as race_summary
import llm_calling.generate_biography as biography_module

MODEL_NAME = "qwen-plus"
API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
SKATERS_DATA_PATH = Path("static/data/scrapper/skater/skaters.ndjson")
SKATERS_USEFUL_COLUMNS = [
    "api_id",
    "first_name",
    "last_name",
    "gender",
    "nationality_code",
    "organization_code",
    "thumbnail_image",
    "status",
    "created_at",
    "updated_at",
    "discipline",
    "is_favourite",
    "results",
    "details",
]
RESULT_HIGHLIGHT_LIMIT = 5


def parse_selected_teams(value: str) -> List[str]:
    return [team.strip() for team in value.split(",") if team.strip()]


def _normalize_rank(value: Any) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def _summarize_results(results: Any) -> dict:
    summary = {
        "events_competed": 0,
        "wins": 0,
        "podiums": 0,
        "top10_finishes": 0,
        "highlights": [],
    }
    if not isinstance(results, list):
        return summary

    condensed: List[dict] = []
    for result in results:
        if not isinstance(result, dict):
            continue
        summary["events_competed"] += 1
        rank = _normalize_rank(result.get("rank"))
        if rank is None:
            continue
        if rank == 1:
            summary["wins"] += 1
        if rank in (1, 2, 3):
            summary["podiums"] += 1
        if rank <= 10:
            summary["top10_finishes"] += 1
        condensed.append(
            {
                "event": result.get("event_name"),
                "category": result.get("category"),
                "rank": rank,
                "location": result.get("country"),
                "date": result.get("date") or result.get("year"),
            }
        )

    condensed.sort(key=lambda item: item["rank"] if item["rank"] is not None else 9999)
    summary["highlights"] = condensed[:RESULT_HIGHLIGHT_LIMIT]
    return summary


def prepare_skater_prompt(skater: dict) -> dict:
    prepared = {
        "skater_id": skater.get("api_id"),
        "first_name": skater.get("first_name"),
        "last_name": skater.get("last_name"),
        "gender": skater.get("gender"),
        "nationality_code": skater.get("nationality_code"),
        "organization_code": skater.get("organization_code"),
        "discipline": skater.get("discipline_title") or skater.get("discipline", {}).get("title"),
        "status": skater.get("status"),
        "created_at": skater.get("created_at"),
        "updated_at": skater.get("updated_at"),
        "details": skater.get("details")
    }

    summary = _summarize_results(skater.get("results"))
    prepared["career_summary"] = summary

    return prepared


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate personalized competition and race summaries using an LLM.",
    )
    parser.add_argument(
        "competition_path",
        type=Path,
        help="Path to the competition JSON file exported from the ISU API.",
    )
    parser.add_argument(
        "output_path",
        type=Path,
        help="Destination path for the generated summaries JSON.",
    )
    parser.add_argument(
        "selected_teams",
        type=parse_selected_teams,
        help="Comma separated country codes to highlight (e.g. 'NED,CHN'). Pass an empty string for all teams.",
    )
    parser.add_argument(
        "api_key",
        help="API key for the LLM provider.",
    )
    return parser.parse_args(argv)


def load_competition_data(competition_path: Path) -> dict:
    logging.debug("Loading competition data for %s", competition_path)
    content = competition_path.read_text(encoding="utf-8")
    return json.loads(content.lstrip("\"Data\":").rstrip(","))


def create_model(api_key: str) -> ChatOpenAI:
    return ChatOpenAI(
        model=MODEL_NAME,
        base_url=API_BASE_URL,
        api_key=api_key,
    )


def determine_team_codes(competition_data: dict, selected_codes: List[str]) -> List[str]:
    ordered_codes: List[str] = []
    seen = set()
    for competitor in competition_data.get("Competitors", []):
        code = competitor["Competitor"]["StartedForNfCode"]
        if code not in seen:
            seen.add(code)
            ordered_codes.append(code)

    if selected_codes:
        filtered = [code for code in selected_codes if code in seen]
        missing = [code for code in selected_codes if code not in seen]
        for code in missing:
            logging.warning("Selected team %s not present in competition data", code)
        if filtered:
            return filtered

    return ordered_codes


def generate_competition_summaries(
    competition_data: dict,
    model: Any,
    team_codes: List[str],
    team_profiles: Dict[str, List[dict]],
) -> Dict[str, Dict[str, str]]:
    logging.info("Generating competition summaries for %s", team_codes)
    summaries = competition_summary.get_competition_summaries(
        competition_data,
        model,
        team_codes,
        team_profiles,
    )
    result: Dict[str, Dict[str, str]] = {}
    for team in team_codes:
        entry = summaries.get(team)
        if not entry:
            logging.warning("No competition summary generated for %s, using fallback.", team)
            result[team] = {
                "title": f"{team} Highlights",
                "text": "",
            }
            continue
        title = entry.get("title") or f"{team} Highlights"
        text = entry.get("text", "")
        result[team] = {
            "title": title,
            "text": text,
        }
    return result


def generate_race_summaries(
    competition_data: dict,
    model: Any,
    team_codes: List[str],
    athlete_biographies: Dict[str, str],
) -> Dict[str, Dict[str, Dict[str, str]]]:
    logging.info("Generating race summaries")
    competition_copy = {"Data": deepcopy(competition_data)}
    improved = race_summary.improve_competition_data(competition_copy)
    data = improved["Data"]

    discipline = data["DisciplineName"]
    race_summaries: Dict[str, Dict[str, Dict[str, str]]] = {}

    for round_data in data.get("Rounds", []):
        round_name = round_data["Name"]
        for heat in round_data.get("Heats", []):
            heat_name = heat["Name"]
            heat_id = heat["Id"]
            team_entries: Dict[str, Dict[str, str]] = {}

            for team_code in team_codes:
                descriptive_heat_name = f"{heat_name} - focus on team {team_code}"
                logging.info("Generating summary for %s", descriptive_heat_name)
                style_hint = race_summary.select_style(f"{team_code}-{heat.get('Id')}")
                text = race_summary.generate_description(
                    model=model,
                    race_data=heat,
                    discipline_name=discipline,
                    round_name=round_name,
                    heat_name=descriptive_heat_name,
                    athlete_profiles=athlete_biographies,
                    style_hint=style_hint,
                )
                title = race_summary.generate_race_title(model, text)
                if not title:
                    title = f"{round_name} · {heat_name} ({team_code})"
                team_entries[team_code] = {
                    "title": title,
                    "text": text,
                }

            race_summaries[heat_id] = team_entries

    return race_summaries


def build_skaters_index() -> Dict[str, dict]:
    if not SKATERS_DATA_PATH.exists():
        raise FileNotFoundError(f"Skater data not found at {SKATERS_DATA_PATH}")

    skaters = biography_module.load_skaters_data(
        SKATERS_DATA_PATH,
        SKATERS_USEFUL_COLUMNS,
    )
    index: Dict[str, dict] = {}
    for skater in skaters:
        api_id = skater.get("api_id")
        if api_id:
            index[str(api_id)] = skater
    return index


def generate_athlete_biographies(
    competition_data: dict,
    model: Any,
) -> Dict[str, str]:
    skaters_index = build_skaters_index()
    biographies: Dict[str, str] = {}

    for competitor in competition_data.get("Competitors", []):
        competitor_id = competitor["Id"]
        if competitor_id in biographies:
            continue

        api_id = str(competitor["Competitor"]["Person"]["Id"])
        skater_data = skaters_index.get(api_id)
        if not skater_data:
            raise KeyError(f"Could not find skater data for competitor {competitor_id} (api_id={api_id})")

        logging.info("Generating athlete biographies for %s", competitor_id)
        prepared_profile = prepare_skater_prompt(skater_data)
        biography_text = biography_module.generate_biography(model, prepared_profile)
        biographies[competitor_id] = biography_text

    return biographies


def build_team_profiles(
    competition_data: dict,
    athlete_biographies: Dict[str, str],
) -> Dict[str, List[dict]]:
    teams: Dict[str, List[dict]] = {}
    for competitor in competition_data.get("Competitors", []):
        competitor_info = competitor.get("Competitor", {})
        team_code = competitor_info.get("StartedForNfCode")
        if not team_code:
            continue
        comp_id = competitor.get("Id")
        name = " ".join(
            part for part in (competitor_info.get("FirstName"), competitor_info.get("LastName")) if part
        ).strip() or competitor_info.get("Person", {}).get("Id", "")
        entry = {
            "id": comp_id,
            "name": name,
            "country": team_code,
            "bio": athlete_biographies.get(comp_id, ""),
        }
        teams.setdefault(team_code, []).append(entry)
    return teams


def write_output(output_path: Path, payload: dict) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False, sort_keys=True)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(level=logging.INFO)

    competition_data = load_competition_data(args.competition_path)
    team_codes = determine_team_codes(competition_data, args.selected_teams)

    if not team_codes:
        logging.error("No team codes found to generate summaries.")
        return 1

    model = create_model(args.api_key)

    athlete_biographies = generate_athlete_biographies(
        competition_data=competition_data,
        model=model,
    )
    team_profiles = build_team_profiles(competition_data, athlete_biographies)
    competition_summaries = generate_competition_summaries(
        competition_data=competition_data,
        model=model,
        team_codes=team_codes,
        team_profiles=team_profiles,
    )
    race_summaries = generate_race_summaries(
        competition_data=competition_data,
        model=model,
        team_codes=team_codes,
        athlete_biographies=athlete_biographies,
    )

    payload = {
        "team_codes": team_codes,
        "competition_personalized_summaries": competition_summaries,
        "race_personalized_summaries": race_summaries,
        "athlete_biographies": athlete_biographies,
    }

    write_output(args.output_path, payload)
    logging.info("LLM summaries written to %s", args.output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
