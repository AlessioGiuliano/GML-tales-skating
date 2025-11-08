import os
import json
from langchain_openai import ChatOpenAI

def load_competition_data(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def generate_summary(model, competition_payload, nationality_code):
    payload_json = json.dumps(competition_payload, indent=2)
    messages = [
        (
            "system",
            f"You are an enthusiastic yet insightful short-track commentator covering team '{nationality_code}'. The provided JSON contains the full event data plus quick bios/results for each {nationality_code} athlete. Craft 4-7 punchy sentences that: (1) spotlight decisive moments (overtakes, penalties, mechanical issues), (2) weave in at least one biographical nugget or trend per highlighted skater, and (3) explain how the result shapes upcoming rounds or the season narrative. Keep it energetic, no bullet lists.",
        ),
        ("human", payload_json),
    ]
    competition_summary = model.invoke(messages).text.strip()
    return competition_summary

def generate_summary_title(model, summary_text: str) -> str:
    messages = [
        (
            "system",
            "Write an electrifying short-track headline (max 8 words) for the recap below. Capture momentum or emotion, avoid quotes and ending punctuation.",
        ),
        ("human", summary_text),
    ]
    return model.invoke(messages).text.strip()

def get_competition_summaries(competition_data, model, nationality_codes, team_profiles):
    result = {}
    for nationality_code in nationality_codes:
        payload = {
            "competition": competition_data,
            "team_profiles": team_profiles.get(nationality_code, []),
        }
        summary = generate_summary(model, payload, nationality_code)
        title = generate_summary_title(model, summary)
        result[nationality_code] = {
            "title": title,
            "text": summary,
        }
    return result

def dict_to_json_file(dict, filepath):
    js = json.dumps(dict)
    fp = open(filepath, 'w')
    fp.write(js)
    fp.close()

if __name__ == "__main__":
    DATA_PATHS = ["./competition_seoul_men.json"]
    NATIONALITY_CODES = ["NED"]

    MODEL_NAME = "qwen-plus"
    API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    API_KEY = os.getenv("API_KEY")
    model = ChatOpenAI(model=MODEL_NAME, base_url=API_BASE_URL, api_key=API_KEY)

    for datapath in DATA_PATHS:
        competition_name = datapath.split("/")[-1].split(".")[0]
        data = load_competition_data(datapath)
        result = get_competition_summaries(data, model, NATIONALITY_CODES, {})
        # FIXME : un fichier par competition ou un fichier avec toutes les competitions (option 1 pour le moment) ?
        dict_to_json_file(result,f"../{competition_name}_summaries.json")
