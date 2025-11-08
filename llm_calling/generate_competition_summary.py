import os
import json
from langchain_openai import ChatOpenAI

def load_competition_data(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def generate_summary(model, competition_data, nationality_code):
    competition_json_str = json.dumps(competition_data, indent=2)
    messages = [
        (
            "system",
            f"You are an enthusiastic yet insightful short-track commentator covering team '{nationality_code}'. Craft 4-7 punchy sentences that celebrate key overtakes, pace changes, penalties, and emotional beats. Highlight the team's standout skaters, contextualize their result versus rivals, and squeeze in one memorable detail (stat, strategy, adversity). Keep the tone energetic but informative; no bullet lists.",
        ),
        ("human", competition_json_str),
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

def get_competition_summaries(competition_data, model, nationality_codes):
    result = {}
    for nationality_code in nationality_codes:
        summary = generate_summary(model, competition_data, nationality_code)
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
        result = get_competition_summaries(data, model, NATIONALITY_CODES)
        # FIXME : un fichier par competition ou un fichier avec toutes les competitions (option 1 pour le moment) ?
        dict_to_json_file(result,f"../{competition_name}_summaries.json")
