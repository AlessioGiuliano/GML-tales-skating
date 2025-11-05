import logging
import os
import sys

from typing import List, TypedDict
import json
import pandas as pd

from langchain_openai import ChatOpenAI

import llm_calling.generate_biography as generate_bio
import llm_calling.generate_competition_summary as competition_summary
import llm_calling.generate_race_description as race_summary

# Import hype score functions from enrichCsv
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from hype_score.enrichCsv import (
    enrich_race_id,
    enrich_lap_times,
    enrich_detect_falls,
    compute_close_finish,
    compute_lead_changes,
    compute_hype_score
)


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

def load_competition_data(competition_path):
    logging.debug(f"Loading competition data for {competition_path}")
    with open(competition_path, mode="r") as f:
        content = f.read().lstrip("\"Data\":").rstrip(',')
        return json.loads(content)

def competition_data_to_competition(location: str, competition: dict) -> Competition:
    return {
        "id": competition['Id'],
        "name": f"{competition['EventName']} - {location} {competition['Start']['Year']}",
        "season": f"{competition['Start']['Year']}/{competition['Start']['Year'] + 1}",
        "location": location,
        "dates": {
            "start": competition['Start']['Date'].split("T")[0],
            "end": competition['Start']['Date'].split("T")[0], # TODO fix with correct value
        },
        "category": competition['DisciplineName'],
    }

def competitor_to_athlete(competitor: dict, skaters_data: dict[str, any], model: ChatOpenAI) -> Athlete:
    api_id = competitor['Competitor']['Person']['Id']
    skater_data = skaters_data[api_id]

    return {
        "id": competitor['Id'],
        "name": competitor['Competitor']['FirstName'] + " " + competitor['Competitor']['LastName'],
        "country": competitor['Competitor']['StartedForNfCode'],
        "team": competitor['Competitor']['StartedForNfCountryName'],
        "bio": str(skater_data['details']) # TODO uncomment generate_bio.generate_biography(model, skater_data)
    }

# if not selected team, support all teams.
def extract_supported_teams(athletes: List[Athlete], selected_teams: List[str]) -> List[SupportedTeam]:
    included = set()
    teams: List[SupportedTeam] = []

    for athlete in athletes:
        if athlete['country'] not in included and (len(selected_teams) == 0 or athlete['country'] in selected_teams):
            included.add(athlete['country'])
            teams.append({
                "key": athlete['country'],
                "name": athlete['team'],
            })

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
    
    for competitor in heat.get('Competitors', []):
        # Parse final result, handling 'no time' and other non-numeric values
        final_result = competitor.get('FinalResult', 0)
        try:
            time_value = float(final_result) if final_result else 0.0
        except (ValueError, TypeError):
            time_value = 0.0
        
        row = {
            'Season': competition_data.get('Start', {}).get('Year', 2024),
            'Series': competition_data.get('EventName', ''),
            # City and Country are used by enrich_race_id to generate unique race IDs via hash
            # Since actual location isn't in JSON, use heat ID and event name for uniqueness
            'City': heat.get('Id', '')[:8],
            'Country': competition_data.get('EventName', ''),
            'Year': competition_data.get('Start', {}).get('Year', 2024),
            'Month': competition_data.get('Start', {}).get('Month', 1),
            'Day': competition_data.get('Start', {}).get('Day', 1),
            'Distance': competition_data.get('DisciplineName', ''),
            'Round': round_data.get('Name', ''),
            'Group': heat.get('Name', ''),
            # Name is used by compute_lead_changes to track leaders across laps
            'Name': competitor.get('CompetitionCompetitorId', ''),
            'Nationality': '',
            'Rank_In_Group': competitor.get('FinalRank', 0),
            'Time': time_value,
        }
        
        # Add lap times and ranks
        for lap in competitor.get('Laps', []):
            lap_num = lap.get('LapNumber', '')
            if lap_num:
                # Convert lap number to int, handling both string and numeric types
                try:
                    lap_num = int(lap_num)
                except (ValueError, TypeError):
                    continue  # Skip invalid lap numbers
                
                # Parse lap time, handling non-numeric values
                lap_time = lap.get('LapTime', 0)
                try:
                    lap_time_value = float(lap_time) if lap_time else 0.0
                except (ValueError, TypeError):
                    lap_time_value = 0.0
                
                # Parse rank, handling non-numeric values
                rank = lap.get('Rank', 0)
                try:
                    rank_value = int(rank) if rank else 0
                except (ValueError, TypeError):
                    rank_value = 0
                
                row[f'time_lap{lap_num}'] = lap_time_value
                row[f'rank_lap{lap_num}'] = rank_value
        
        rows.append(row)
    
    return pd.DataFrame(rows)

def compute_race_hype_score(heat: dict, round_data: dict, competition_data: dict) -> float:
    """
    Compute hype score for a race using functions from enrichCsv.
    
    The hype score quantifies race excitement based on:
    - Falls detected: -1.0 per fall (negative impact)
    - Close finish: +2.5 if finish within 0.15 seconds
    - Lead changes: +1.5 per lead change across laps
    - Round factor: +1.0 base score
    
    Args:
        heat: Heat data from ISU API containing competitors and lap information
        round_data: Round data containing round name and other metadata
        competition_data: Competition-level data with event name, dates, etc.
    
    Returns:
        Computed hype score as a float. Typical ranges:
        - 0.0-1.0: Low excitement (falls, no close finish, no lead changes)
        - 1.0-2.0: Moderate excitement (base round factor)
        - 2.5-4.0: High excitement (close finish and/or lead changes)
    """
    # Convert race data to dataframe
    df = convert_race_to_dataframe(heat, round_data, competition_data)
    
    if df.empty:
        return 0.0
    
    # Apply enrichment functions from enrichCsv
    df = enrich_race_id(df)
    df = enrich_lap_times(df)
    df = enrich_detect_falls(df)
    df = compute_close_finish(df)
    df = compute_lead_changes(df)
    df = compute_hype_score(df)
    
    # Return the hype score (should be same for all rows in the race)
    if 'HypeScore' in df.columns and not df.empty:
        return float(df['HypeScore'].iloc[0])
    
    return 0.0

def load_skaters_data():
    useful_columns = ['api_id', 'first_name', 'last_name', 'gender', 'nationality_code', 'organization_code',
                      'thumbnail_image', 'status', 'created_at', 'updated_at', 'discipline', 'is_favourite', 'results',
                      'details']
    skaters_list = generate_bio.load_skaters_data(
        './static/data/scrapper/skater/skaters.ndjson',
        useful_columns
    )

    return {skater['api_id']: skater for skater in skaters_list}

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    args = sys.argv[1:]

    if len(args) != 4:
        logging.error("Usage: python generate_static_api.py path/to/competition.json path/to/output.json NED,CHN MODEL_KEY")

    # read cli args
    competition_path = args[0]
    output_path = args[1]
    selected_teams = args[2].split(',')
    api_key = args[3]

    # load skaters data
    skater_data = load_skaters_data()
    MODEL_NAME = "qwen-plus"
    API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    model = ChatOpenAI(model=MODEL_NAME, base_url=API_BASE_URL, api_key=api_key)

    # load competition data
    logging.info(f"Generating static API files for {competition_path}")
    competition_data = load_competition_data(competition_path)

    # generate competition data
    logging.info("Generation base competition object")
    competition = competition_data_to_competition(
        os.path.basename(competition_path).split(" ")[0], # ugly way to extract location :D
        competition_data
    )
    logging.debug(competition)

    # generate bio for all skaters
    logging.info("Generating skater data")
    athletes = [
        competitor_to_athlete(competitor, skater_data, model)
        for competitor in competition_data['Competitors']
    ]
    logging.debug(athletes)

    # extract teams
    logging.info("Generating supported teams")
    supported_teams = extract_supported_teams(athletes, selected_teams)
    logging.debug(supported_teams)

    # generate team personalized summaries
    logging.info("Generating personalized summaries")
    competition['personalized_summaries'] = {
        team['key']: {
            'title': 'TODO',
            'text': 'todo' # TODO uncomment competition_summary.generate_summary(model, competition_data, team['key'])
        }
        for team in supported_teams
    }
    logging.debug(competition['personalized_summaries'])

    # athlete index
    athlete_idx = {
        athlete['id']: athlete
        for athlete in athletes
    }

    # generating phases
    logging.info("Generating phases")
    competition['phases'] = []
    for round in competition_data['Rounds']:
        phase: Phase = {
            "name": round['Name'],
            "order": round['DisplayOrder'],
            "races": []
        }

        for heat in round['Heats']:
            # Compute hype score for this race
            hype_score = compute_race_hype_score(heat, round, competition_data)
            
            race: Race = {
                "id": heat['Id'],
                "title": heat['Name'],
                "video_url": "TODO", # TODO
                "hype_score": hype_score,
                "personalized_summaries": { # TODO
                    team['key']: {
                        'title': 'TODO',
                        'text': 'TODO' # TODO uncomment race_summary.generate_description(
                        #     model,
                        #     race_data=heat,
                        #     discipline_name=competition_data['DisciplineName'],
                        #     round_name=round['Name'],
                        #     heat_name=heat['Name'],
                        # )
                    }
                    for team in supported_teams
                },
                "results": []
            }

            for competitor in heat['Competitors']:
                result: Result = {
                    'rank': competitor['FinalRank'],
                    'athlete': athlete_idx[competitor['CompetitionCompetitorId']],
                    'time': competitor['FinalResult'],
                    'splits': []
                }

                for lap in competitor['Laps']:
                    split: Split = {
                        "lap": lap['LapNumber'],
                        "time": lap['LapTime'],
                    }

                    result['splits'].append(split)

                race['results'].append(result)

            phase['races'].append(race)

        competition['phases'].append(phase)

    logging.debug(competition['phases'])

    # save output
    content: Root = {
        "competition": competition,
        "supported_teams": supported_teams
    }

    with open(output_path, "w+") as f:
        json.dump(content, f, indent=2, sort_keys=True, ensure_ascii=False)






