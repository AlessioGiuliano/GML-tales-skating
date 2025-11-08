import argparse
import json
import logging
from copy import deepcopy
from pathlib import Path
from typing import Dict, List, Sequence

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


def parse_selected_teams(value: str) -> List[str]:
    return [team.strip() for team in value.split(",") if team.strip()]


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
    model: ChatOpenAI,
    team_codes: List[str],
) -> Dict[str, Dict[str, str]]:
    logging.info("Generating competition summaries for %s", team_codes)
    summaries = competition_summary.get_competition_summaries(
        competition_data,
        model,
        team_codes,
    )
    return {
        team: {
            "title": f"{team} Highlights",
            "text": text,
        }
        for team, text in summaries.items()
    }


def generate_race_summaries(
    competition_data: dict,
    model: ChatOpenAI,
    team_codes: List[str],
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
                text = race_summary.generate_description(
                    model=model,
                    race_data=heat,
                    discipline_name=discipline,
                    round_name=round_name,
                    heat_name=descriptive_heat_name,
                )
                team_entries[team_code] = {
                    "title": f"{round_name} · {heat_name} ({team_code})",
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
    model: ChatOpenAI,
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

        biography_text = biography_module.generate_biography(model, skater_data)
        biographies[competitor_id] = biography_text

    return biographies


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

    competition_summaries = generate_competition_summaries(
        competition_data=competition_data,
        model=model,
        team_codes=team_codes,
    )
    race_summaries = generate_race_summaries(
        competition_data=competition_data,
        model=model,
        team_codes=team_codes,
    )
    athlete_biographies = generate_athlete_biographies(
        competition_data=competition_data,
        model=model,
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
