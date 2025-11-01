import os
import json
from langchain_openai import ChatOpenAI

def load_competition_data(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def generate_summary(model, competition_data, nationality_code):
    competition_json_str = json.dumps(competition_data, indent=2)
    # FIXME : possibilite d'ameliorer le prompt pour obtenir plus de details sur les courses
    messages = [
        (
            "system",
            f"Your task is to summarize a competition using given data from the point of view of the team corresponding to the organization code '{nationality_code}'. You have to behave like a sportscaster supporting the given team, but stay neutral. Format : raw text and maximum 10 lines."
        ),
        ("human", competition_json_str),
    ]
    competition_summary = model.invoke(messages).text
    return competition_summary

def get_competition_summaries(competition_data, model, nationality_codes):
    result = {}
    for nationality_code in nationality_codes:
        summary = generate_summary(model, competition_data, nationality_code)
        result[nationality_code] = summary
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
