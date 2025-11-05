import argparse
import json
import logging
from pathlib import Path
from typing import List, Sequence, TypedDict

import pandas as pd
from langchain_openai import ChatOpenAI

import llm_calling.generate_biography as generate_bio
import llm_calling.generate_competition_summary as competition_summary
import llm_calling.generate_race_description as race_summary
from hype_score.enrichCsv import (
    compute_close_finish,
    compute_hype_score,
    compute_lead_changes,
    enrich_detect_falls,
    enrich_lap_times,
    enrich_race_id,
)

MODEL_NAME = "qwen-plus"
API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"


class Athlete(TypedDict):
    id: str
    name: str
    country: str
    team: str
    bio: str


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


def parse_selected_teams(value: str) -> List[str]:
    return [team.strip() for team in value.split(",") if team.strip()]


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a static API file from an ISU competition JSON export.",
    )
    parser.add_argument(
        "competition_path",
        type=Path,
        help="Path to the competition JSON file exported from the ISU API.",
    )
    parser.add_argument(
        "output_path",
        type=Path,
        help="Destination path for the generated static API payload.",
    )
    parser.add_argument(
        "selected_teams",
        type=parse_selected_teams,
        help="Comma separated country codes to highlight (e.g. 'NED,CHN'). Pass an empty string to include every team present in the data.",
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


def competition_data_to_competition(location: str, competition: dict) -> Competition:
    return {
        "id": competition["Id"],
        "name": f"{competition['EventName']} - {location} {competition['Start']['Year']}",
        "season": f"{competition['Start']['Year']}/{competition['Start']['Year'] + 1}",
        "location": location,
        "dates": {
            "start": competition["Start"]["Date"].split("T")[0],
            "end": competition["Start"]["Date"].split("T")[0],  # TODO fix with correct value
        },
        "category": competition["DisciplineName"],
    }


def competitor_to_athlete(competitor: dict, skaters_data: dict[str, any], model: ChatOpenAI) -> Athlete:
    api_id = competitor["Competitor"]["Person"]["Id"]
    skater_data = skaters_data[api_id]

    return {
        "id": competitor["Id"],
        "name": f"{competitor['Competitor']['FirstName']} {competitor['Competitor']['LastName']}",
        "country": competitor["Competitor"]["StartedForNfCode"],
        "team": competitor["Competitor"]["StartedForNfCountryName"],
        "bio": str(skater_data["details"]),  # TODO uncomment generate_bio.generate_biography(model, skater_data)
    }


def extract_supported_teams(athletes: List[Athlete], selected_teams: List[str]) -> List[SupportedTeam]:
    included = set()
    teams: List[SupportedTeam] = []

    for athlete in athletes:
        if athlete["country"] not in included and (len(selected_teams) == 0 or athlete["country"] in selected_teams):
            included.add(athlete["country"])
            teams.append(
                {
                    "key": athlete["country"],
                    "name": athlete["team"],
                }
            )

    return teams


def convert_race_to_dataframe(heat: dict, round_data: dict, competition_data: dict) -> pd.DataFrame:
    """
    Convert JSON race data to DataFrame matching enrichCsv requirements.

    Args:
        heat: Heat data from ISU API containing competitors and lap information
        round_data: Round data containing round name and other metadata
        competition_data: Competition-level data with event name, dates, etc.

    Returns:
        DataFrame with columns required by enrichCsv functions:
        - Season, Series, City, Country, Year, Month, Day, Distance, Round, Group
        - Name, Nationality, Rank_In_Group, Time
        - time_lap1, time_lap2, ..., time_lap5
        - rank_lap1, rank_lap2, ..., rank_lap5
    """
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


def load_skaters_data() -> dict[str, any]:
    useful_columns = [
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
    skaters_list = generate_bio.load_skaters_data(
        "static/data/scrapper/skater/skaters.ndjson",
        useful_columns,
    )

    return {skater["api_id"]: skater for skater in skaters_list}


def extract_location_from_path(path: Path) -> str:
    return path.stem.split(" ")[0]


def build_competition_summaries(supported_teams: List[SupportedTeam]) -> dict[str, Country]:
    return {
        team["key"]: {
            "title": "TODO",
            "text": "todo",  # TODO uncomment competition_summary.generate_summary(...)
        }
        for team in supported_teams
    }


def build_race_summaries(supported_teams: List[SupportedTeam]) -> dict[str, Country]:
    return {
        team["key"]: {
            "title": "TODO",
            "text": "TODO",  # TODO uncomment race_summary.generate_description(...)
        }
        for team in supported_teams
    }


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
) -> Race:
    hype_score = compute_race_hype_score(heat, round_data, competition_data)

    race: Race = {
        "id": heat["Id"],
        "title": heat["Name"],
        "video_url": "TODO",
        "hype_score": hype_score,
        "personalized_summaries": build_race_summaries(supported_teams),
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
            )
        )

    return phase


def create_model(api_key: str) -> ChatOpenAI:
    return ChatOpenAI(
        model=MODEL_NAME,
        base_url=API_BASE_URL,
        api_key=api_key,
    )


def generate_athletes(competition_data: dict, skater_data: dict[str, any], model: ChatOpenAI) -> List[Athlete]:
    return [
        competitor_to_athlete(competitor, skater_data, model)
        for competitor in competition_data["Competitors"]
    ]


def build_phases(
    competition_data: dict,
    supported_teams: List[SupportedTeam],
    athlete_idx: dict[str, Athlete],
) -> List[Phase]:
    return [
        build_phase(
            round_data=round_data,
            supported_teams=supported_teams,
            athlete_idx=athlete_idx,
            competition_data=competition_data,
        )
        for round_data in competition_data["Rounds"]
    ]


def generate_static_api_content(
    competition_path: Path,
    selected_teams: List[str],
    api_key: str,
) -> Root:
    skater_data = load_skaters_data()
    model = create_model(api_key)
    competition_raw = load_competition_data(competition_path)

    location = extract_location_from_path(competition_path)
    competition = competition_data_to_competition(location, competition_raw)

    logging.info("Generating skater data")
    athletes = generate_athletes(competition_raw, skater_data, model)
    logging.debug("Generated %d athletes", len(athletes))

    logging.info("Generating supported teams")
    supported_teams = extract_supported_teams(athletes, selected_teams)
    logging.debug("Supported teams: %s", supported_teams)

    logging.info("Generating competition summaries")
    competition["personalized_summaries"] = build_competition_summaries(supported_teams)

    athlete_idx = {athlete["id"]: athlete for athlete in athletes}

    logging.info("Generating phases and races")
    competition["phases"] = build_phases(
        competition_data=competition_raw,
        supported_teams=supported_teams,
        athlete_idx=athlete_idx,
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
        selected_teams=args.selected_teams,
        api_key=args.api_key,
    )

    write_output(args.output_path, content)
    logging.info("Static API file written to %s", args.output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
