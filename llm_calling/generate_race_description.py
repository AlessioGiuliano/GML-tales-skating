import os
import json
from typing import Dict, List, Optional

from langchain_openai import ChatOpenAI

def load_races_data(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def improve_competition_data(data):
    improved_data = data
    for round in improved_data["Data"]["Rounds"]:
        for heat in round["Heats"]:
            for competitor in heat["Competitors"]:
                competitor["FirstName"] = next(
                    (c["Competitor"]["Person"]["FirstName"] for c in data["Data"]["Competitors"] if
                     c["Id"] == competitor["CompetitionCompetitorId"]), None)
                competitor["LastName"] = next(
                    (c["Competitor"]["Person"]["LastName"] for c in data["Data"]["Competitors"] if
                     c["Id"] == competitor["CompetitionCompetitorId"]), None)
    return improved_data

def _build_competitor_profiles(race_data: dict, athlete_profiles: Optional[Dict[str, str]] = None) -> List[dict]:
    profiles = []
    athlete_profiles = athlete_profiles or {}
    for competitor in race_data.get("Competitors", []):
        comp_id = competitor.get("CompetitionCompetitorId")
        fullname = " ".join(
            part for part in (competitor.get("FirstName"), competitor.get("LastName")) if part
        ).strip() or comp_id
        profiles.append(
            {
                "id": comp_id,
                "name": fullname,
                "country": competitor.get("StartedForNfCode"),
                "bio": athlete_profiles.get(comp_id, ""),
            }
        )
    return profiles

def generate_description(model, race_data, discipline_name, round_name, heat_name, athlete_profiles: Optional[Dict[str, str]] = None):
    payload = {
        "race": race_data,
        "competitor_profiles": _build_competitor_profiles(race_data, athlete_profiles),
    }
    competition_json_str = json.dumps(payload, indent=2)
    messages = [
        (
            "system",
            f"You are a rink-side commentator covering the {discipline_name} • {round_name} • {heat_name} heat. Deliver 5-7 vivid sentences summarizing decisive passes, lap-to-lap momentum, penalties, and any clutch saves. Thread in nuggets from the provided athlete bios to explain WHY results mattered (career arcs, styles, nicknames). Open with the race's key inflection point, keep it raw text (no numbering), and close with takeaway stakes for the next round.",
        ),
        ("human", competition_json_str),
    ]
    race_description = model.invoke(messages).text
    return race_description

def generate_race_title(model, description_text: str) -> str:
    messages = [
        (
            "system",
            "Produce a thrilling short-track headline (≤8 words) that captures the drama of the recap. Favor action verbs, no punctuation at the end.",
        ),
        ("human", description_text),
    ]
    return model.invoke(messages).text.strip()

def get_race_descriptions(competition_data, model, athlete_profiles: Optional[Dict[str, str]] = None):
    discipline_name = competition_data["Data"]["DisciplineName"]
    result = {discipline_name : []}
    for round in competition_data["Data"]["Rounds"]:
        round_name = round["Name"]
        round_entry = {round_name: []}
        for heat in round["Heats"]:
            heat_name = heat["Name"]
            description = generate_description(model, heat, discipline_name, round_name, heat_name, athlete_profiles)
            round_entry[round_name].append({heat_name : description})
            break # TODO : remove break to have description for all races
        result[discipline_name].append(round_entry)
    return result

def dict_to_json_file(dict, filepath):
    js = json.dumps(dict)
    fp = open(filepath, 'w')
    fp.write(js)
    fp.close()

if __name__ == "__main__":
    DATA_PATHS = ["./competition_seoul_men.json"]

    MODEL_NAME = "qwen-plus"
    API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    API_KEY = os.getenv("API_KEY")
    model = ChatOpenAI(model=MODEL_NAME, base_url=API_BASE_URL, api_key=API_KEY)

    for datapath in DATA_PATHS:
        competition_name = datapath.split("/")[-1].split(".")[0]
        data = load_races_data(datapath)
        data = improve_competition_data(data) # otherwise llm calls the skater with his bib number
        result = get_race_descriptions(data, model)
        # FIXME : un fichier par competition ou un fichier avec toutes les competitions (option 1 pour le moment) ?
        dict_to_json_file(result,f"../{competition_name}_race_descriptions.json")
