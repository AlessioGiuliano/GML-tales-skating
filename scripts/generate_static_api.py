import argparse
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Sequence, TypedDict

import pandas as pd

from hype_score.enrichCsv import (
    compute_close_finish,
    compute_hype_score,
    compute_lead_changes,
    enrich_detect_falls,
    enrich_lap_times,
    enrich_race_id,
)


SKATERS_DATA_PATH = Path("static/data/scrapper/skater/skaters.ndjson")


class Athlete(TypedDict):
    id: str
    name: str
    country: str
    team: str
    bio: str
    thumbnail_image: str


class Dates(TypedDict):
    start: str
    end: str


class Country(TypedDict):
    title: str
    text: str


class Split(TypedDict):
    lap: int
    time: str


class Result(TypedDict):
    rank: int
    athlete: Athlete
    time: str
    splits: List[Split]


class Race(TypedDict):
    id: str
    title: str
    video_url: str
    hype_score: float
    personalized_summaries: dict[str, Country]
    results: List[Result]


class Phase(TypedDict):
    name: str
    order: int
    races: List[Race]


class Competition(TypedDict):
    id: str
    name: str
    season: str
    location: str
    dates: Dates
    category: str
    personalized_summaries: dict[str, Country]
    phases: List[Phase]


class SupportedTeam(TypedDict):
    key: str
    name: str


class Root(TypedDict):
    competition: Competition
    supported_teams: List[SupportedTeam]


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Assemble the static API payload using pre-generated LLM summaries.",
    )
    parser.add_argument(
        "competition_path",
        type=Path,
        help="Path to the competition JSON file exported from the ISU API.",
    )
    parser.add_argument(
        "summaries_path",
        type=Path,
        help="Path to the JSON output from generate_summaries_llm.py.",
    )
    parser.add_argument(
        "output_path",
        type=Path,
        help="Destination path for the generated static API payload.",
    )
    return parser.parse_args(argv)


def load_competition_data(competition_path: Path) -> dict:
    logging.debug("Loading competition data for %s", competition_path)
    content = competition_path.read_text(encoding="utf-8")
    return json.loads(content.lstrip("\"Data\":").rstrip(","))


def load_llm_output(summaries_path: Path) -> dict:
    logging.debug("Loading LLM summaries from %s", summaries_path)
    with summaries_path.open(encoding="utf-8") as f:
        payload = json.load(f)

    required_keys = {"team_codes", "competition_personalized_summaries", "race_personalized_summaries", "athlete_biographies"}
    missing = required_keys.difference(payload)
    if missing:
        raise KeyError(f"LLM output missing required keys: {', '.join(sorted(missing))}")

    return payload


def load_thumbnail_index(skater_data_path: Path = SKATERS_DATA_PATH) -> Dict[str, str]:
    thumbnails: Dict[str, str] = {}
    if not skater_data_path.exists():
        logging.warning("Skater data path %s not found; athlete thumbnails will be empty.", skater_data_path)
        return thumbnails

    with skater_data_path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            api_id = record.get("api_id")
            if not api_id:
                continue
            thumb = record.get("thumbnail_image") or record.get("image") or ""
            thumbnails[str(api_id)] = thumb
    return thumbnails


def compute_competition_end_date(competition: dict) -> str:
    latest: datetime | None = None
    for round_data in competition.get("Rounds", []):
        for heat in round_data.get("Heats", []):
            start_info = heat.get("Start", {})
            ts = start_info.get("Date")
            if not ts:
                continue
            normalized = ts.replace("Z", "+00:00")
            try:
                dt = datetime.fromisoformat(normalized)
            except ValueError:
                continue
            if latest is None or dt > latest:
                latest = dt

    if latest is not None:
        return latest.date().isoformat()

    # fallback
    return competition.get("Start", {}).get("Date", "").split("T")[0]


def competition_data_to_competition(location: str, competition: dict) -> Competition:
    start_date = competition["Start"]["Date"].split("T")[0]
    end_date = compute_competition_end_date(competition)
    return {
        "id": competition["Id"],
        "name": f"{competition['EventName']} - {location} {competition['Start']['Year']}",
        "season": f"{competition['Start']['Year']}/{competition['Start']['Year'] + 1}",
        "location": location,
        "dates": {
            "start": start_date,
            "end": end_date,
        },
        "category": competition["DisciplineName"],
    }


def competitor_to_athlete(
    competitor: dict,
    athlete_biographies: Dict[str, str],
    thumbnails: Dict[str, str],
) -> Athlete:
    competitor_id = competitor["Id"]
    try:
        biography = athlete_biographies[competitor_id]
    except KeyError as exc:
        raise KeyError(f"Missing biography for competitor {competitor_id}") from exc
    person_id = str(competitor["Competitor"]["Person"]["Id"])

    return {
        "id": competitor_id,
        "name": f"{competitor['Competitor']['FirstName']} {competitor['Competitor']['LastName']}",
        "country": competitor["Competitor"]["StartedForNfCode"],
        "team": competitor["Competitor"]["StartedForNfCountryName"],
        "bio": biography,
        "thumbnail_image": thumbnails.get(person_id, ""),
    }


def extract_supported_teams(athletes: List[Athlete], selected_codes: List[str]) -> List[SupportedTeam]:
    filtered_codes = set(selected_codes)
    allow_all = len(filtered_codes) == 0
    included = set()
    teams: List[SupportedTeam] = []

    for athlete in athletes:
        if athlete["country"] in included:
            continue
        if not allow_all and athlete["country"] not in filtered_codes:
            continue
        included.add(athlete["country"])
        teams.append(
            {
                "key": athlete["country"],
                "name": athlete["team"],
            }
        )

    return teams


def convert_race_to_dataframe(heat: dict, round_data: dict, competition_data: dict) -> pd.DataFrame:
    rows = []

    for competitor in heat.get("Competitors", []):
        final_result = competitor.get("FinalResult", 0)
        try:
            time_value = float(final_result) if final_result else 0.0
        except (ValueError, TypeError):
            time_value = 0.0

        row = {
            "Season": competition_data.get("Start", {}).get("Year", 2024),
            "Series": competition_data.get("EventName", ""),
            "City": heat.get("Id", "")[:8],
            "Country": competition_data.get("EventName", ""),
            "Year": competition_data.get("Start", {}).get("Year", 2024),
            "Month": competition_data.get("Start", {}).get("Month", 1),
            "Day": competition_data.get("Start", {}).get("Day", 1),
            "Distance": competition_data.get("DisciplineName", ""),
            "Round": round_data.get("Name", ""),
            "Group": heat.get("Name", ""),
            "Name": competitor.get("CompetitionCompetitorId", ""),
            "Nationality": "",
            "Rank_In_Group": competitor.get("FinalRank", 0),
            "Time": time_value,
        }

        for lap in competitor.get("Laps", []):
            lap_num = lap.get("LapNumber", "")
            try:
                lap_num = int(lap_num)
            except (ValueError, TypeError):
                continue

            lap_time = lap.get("LapTime", 0)
            try:
                lap_time_value = float(lap_time) if lap_time else 0.0
            except (ValueError, TypeError):
                lap_time_value = 0.0

            rank = lap.get("Rank", 0)
            try:
                rank_value = int(rank) if rank else 0
            except (ValueError, TypeError):
                rank_value = 0

            row[f"time_lap{lap_num}"] = lap_time_value
            row[f"rank_lap{lap_num}"] = rank_value

        rows.append(row)

    return pd.DataFrame(rows)


def compute_race_hype_score(heat: dict, round_data: dict, competition_data: dict) -> float:
    df = convert_race_to_dataframe(heat, round_data, competition_data)

    if df.empty:
        return 0.0

    df = enrich_race_id(df)
    df = enrich_lap_times(df)
    df = enrich_detect_falls(df)
    df = compute_close_finish(df)
    df = compute_lead_changes(df)
    df = compute_hype_score(df)

    if "HypeScore" in df.columns and not df.empty:
        return float(df["HypeScore"].iloc[0])

    return 0.0


def extract_location_from_path(path: Path) -> str:
    return path.stem.split(" ")[0]


def build_result(competitor: dict, athlete: Athlete) -> Result:
    return {
        "rank": competitor["FinalRank"],
        "athlete": athlete,
        "time": competitor["FinalResult"],
        "splits": [
            {
                "lap": lap["LapNumber"],
                "time": lap["LapTime"],
            }
            for lap in competitor.get("Laps", [])
        ],
    }


def build_race(
    heat: dict,
    round_data: dict,
    supported_teams: List[SupportedTeam],
    athlete_idx: dict[str, Athlete],
    competition_data: dict,
    llm_race_summaries: dict[str, dict[str, Country]],
) -> Race:
    hype_score = compute_race_hype_score(heat, round_data, competition_data)

    heat_id = heat["Id"]
    try:
        personalized = llm_race_summaries[heat_id]
    except KeyError as exc:
        raise KeyError(f"Missing race summaries for heat {heat_id}") from exc

    summaries = {}
    for team in supported_teams:
        key = team["key"]
        if key not in personalized:
            raise KeyError(f"Missing race summary for heat {heat_id} and team {key}")
        summaries[key] = personalized[key]

    race: Race = {
        "id": heat["Id"],
        "title": heat["Name"],
        "video_url": f"https://gml-hackathon-isu.oss-eu-central-1.aliyuncs.com/videos/{competition_data["Id"]}/{heat_id}.webm",
        "hype_score": hype_score,
        "personalized_summaries": summaries,
        "results": [],
    }

    for competitor in heat.get("Competitors", []):
        competition_competitor_id = competitor["CompetitionCompetitorId"]
        race["results"].append(build_result(competitor, athlete_idx[competition_competitor_id]))

    return race


def build_phase(
    round_data: dict,
    supported_teams: List[SupportedTeam],
    athlete_idx: dict[str, Athlete],
    competition_data: dict,
    llm_race_summaries: dict[str, dict[str, Country]],
) -> Phase:
    phase: Phase = {
        "name": round_data["Name"],
        "order": round_data.get("DisplayOrder", 0),
        "races": [],
    }

    for heat in round_data.get("Heats", []):
        phase["races"].append(
            build_race(
                heat=heat,
                round_data=round_data,
                supported_teams=supported_teams,
                athlete_idx=athlete_idx,
                competition_data=competition_data,
                llm_race_summaries=llm_race_summaries,
            )
        )

    return phase


def build_phases(
    competition_data: dict,
    supported_teams: List[SupportedTeam],
    athlete_idx: dict[str, Athlete],
    llm_race_summaries: dict[str, dict[str, Country]],
) -> List[Phase]:
    return [
        build_phase(
            round_data=round_data,
            supported_teams=supported_teams,
            athlete_idx=athlete_idx,
            competition_data=competition_data,
            llm_race_summaries=llm_race_summaries,
        )
        for round_data in competition_data["Rounds"]
    ]


def generate_static_api_content(
    competition_path: Path,
    summaries_path: Path,
) -> Root:
    competition_raw = load_competition_data(competition_path)
    llm_payload = load_llm_output(summaries_path)
    thumbnails = load_thumbnail_index()

    location = extract_location_from_path(competition_path)
    competition = competition_data_to_competition(location, competition_raw)

    athlete_biographies: Dict[str, str] = llm_payload["athlete_biographies"]

    logging.info("Generating skater data")
    athletes = [
        competitor_to_athlete(competitor, athlete_biographies, thumbnails)
        for competitor in competition_raw["Competitors"]
    ]
    logging.debug("Generated %d athletes", len(athletes))

    selected_codes = llm_payload.get("team_codes", [])
    logging.info("Preparing supported teams filtered by: %s", selected_codes)
    supported_teams = extract_supported_teams(athletes, selected_codes)
    logging.debug("Supported teams: %s", supported_teams)

    llm_comp_summaries = llm_payload.get("competition_personalized_summaries", {})
    competition_summaries: dict[str, Country] = {}
    for team in supported_teams:
        key = team["key"]
        if key not in llm_comp_summaries:
            raise KeyError(f"Missing competition summary for team {key}")
        competition_summaries[key] = llm_comp_summaries[key]
    competition["personalized_summaries"] = competition_summaries

    athlete_idx = {athlete["id"]: athlete for athlete in athletes}

    llm_race_summaries = llm_payload.get("race_personalized_summaries", {})
    logging.info("Building phases and attaching personalized race summaries")
    competition["phases"] = build_phases(
        competition_data=competition_raw,
        supported_teams=supported_teams,
        athlete_idx=athlete_idx,
        llm_race_summaries=llm_race_summaries,
    )

    return {
        "competition": competition,
        "supported_teams": supported_teams,
    }


def write_output(output_path: Path, content: Root) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, sort_keys=True, ensure_ascii=False)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(level=logging.DEBUG)
    logging.info("Generating static API files for %s", args.competition_path)

    content = generate_static_api_content(
        competition_path=args.competition_path,
        summaries_path=args.summaries_path,
    )

    write_output(args.output_path, content)
    logging.info("Static API file written to %s", args.output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
