import os
import json
from collections import defaultdict
from langchain_openai import ChatOpenAI

def load_skaters_data(datapath, useful_columns):
    data = []
    with open(datapath, "r", encoding="utf-8") as f:
        for line in f:
            try:
                record = json.loads(line)
                filtered_record = {col: record.get(col) for col in useful_columns}
                data.append(filtered_record)
            except json.JSONDecodeError:
                continue
    return data

def generate_biography(model, skater_data):
    skater_json_str = json.dumps(skater_data, indent=2)
    messages = [
        (
            "system",
            " Your task is to write a text of 5 sentences using given data. If some information is missing, do not make anything up. I would like to have a general summary of this athlete (including sporting achievements), but also any unusual information.",
        ),
        ("human", skater_json_str),
    ]
    skater_biography = model.invoke(messages).text
    return skater_biography

def get_biographies(nationality_codes, skaters_data, model):
    result = defaultdict(list)
    for skater in skaters_data:
        nationality_code = skater.get("nationality_code")
        if nationality_code in nationality_codes:
            biography = generate_biography(model, skater)
            result[nationality_code].append({
                "skater_id": skater.get("skaters_id"),
                "skater_firstname": skater.get("first_name"),
                "skater_lastname": skater.get("last_name"),
                "biography": biography
            })
            # TODO : remove break to generate for all skaters
            break
    return result

def dict_to_json_file(dict, filepath):
    js = json.dumps(dict)
    fp = open(filepath, 'w')
    fp.write(js)
    fp.close()

if __name__ == "__main__":
    # load skaters data retrieved from ISU website
    DATA_PATH = "../skaters.ndjson"
    USEFUL_COLUMNS = ['skaters_id', 'first_name', 'last_name', 'gender', 'nationality_code', 'organization_code',
                      'thumbnail_image', 'status', 'created_at', 'updated_at', 'discipline', 'is_favourite', 'results',
                      'details']
    data = load_skaters_data(DATA_PATH, USEFUL_COLUMNS)

    # generate biographies of all skaters for desired countries and write it into json file
    MODEL_NAME = "qwen-plus"
    API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    API_KEY = os.getenv("API_KEY")
    NATIONALITY_CODES = ["NED"]
    RESULT_PATH = "../biographies.json"
    model = ChatOpenAI(model=MODEL_NAME, base_url=API_BASE_URL, api_key=API_KEY)
    result = get_biographies(NATIONALITY_CODES, data, model)
    dict_to_json_file(result, RESULT_PATH)
