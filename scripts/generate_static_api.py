import logging
import os
import sys

from typing import List, TypedDict
import json

from langchain_openai import ChatOpenAI

import llm_calling.generate_biography as generate_bio

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
        "bio": str(skater_data['details']) # generate_bio.generate_biography(model, skater_data)
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
            'text': 'TODO'
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
            race: Race = {
                "id": heat['Id'],
                "title": heat['Name'],
                "video_url": "TODO", # TODO
                "hype_score": 3, # TODO
                "personalized_summaries": { # TODO
                    team['key']: {
                        'title': 'TODO',
                        'text': 'TODO'
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






