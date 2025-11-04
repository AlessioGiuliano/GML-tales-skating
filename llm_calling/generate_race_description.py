import os
import json
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

def generate_description(model, race_data, discipline_name, round_name, heat_name):
    competition_json_str = json.dumps(race_data, indent=2)
    messages = [
        (
            "system",
            f"You are a sportscaster dedicated to describing the short track speed skating race for the {discipline_name} discipline during the {round_name} round and the {heat_name} heat. You will briefly give the ranking (e.g., 1. athlete name (time, gap with the athlete just before), 2. ...) and describe the race (overtakes, falls, accelerations, penalties, whether the ranking was decided from the start or remained extremely close until the end, etc.). Keep it simple (raw text), and maximum 10 lines."
        ),
        ("human", competition_json_str),
    ]
    race_description = model.invoke(messages).text
    return race_description

def get_race_descriptions(competition_data, model):
    discipline_name = competition_data["Data"]["DisciplineName"]
    result = {discipline_name : []}
    for round in competition_data["Data"]["Rounds"]:
        round_name = round["Name"]
        round_entry = {round_name: []}
        for heat in round["Heats"]:
            heat_name = heat["Name"]
            description = generate_description(model, heat, discipline_name, round_name, heat_name)
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
