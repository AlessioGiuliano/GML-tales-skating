# from https://medium.com/garantibbva-teknoloji/understanding-llm-tool-calling-traditional-vs-embedded-approaches-fc7e576d05de
# improved using https://docs.langchain.com/oss/python/langchain/tools

# goal -> produce a brief description of a skater based on ISU website
# TODO : produce a brief description of a race based on data given for hackathon

import json
import os

from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from langchain_core.tools import tool

def load_skaters_data(filepath):
    data = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return data

@tool
def get_skater_info(first_name: str = "", last_name: str = "") -> dict:
    """Retrieve info about a specific skater by first name and last name.
        Args:
            first_name: The first name of the skater (required)
            last_name: The last name of the skater (required)
        Returns:
            Dictionary containing skater information or error message
    """
    if first_name != "" and last_name != "":
        for skater in SKATERS_DATA:
            if skater.get("last_name", "").lower() == last_name.lower() and skater.get("first_name", "").lower() == first_name.lower():
                return {
                    "skaters_id": skater.get("skaters_id"),
                    "first_name": skater.get("first_name"),
                    "last_name": skater.get("last_name"),
                    "gender": skater.get("gender"),
                    "nationality_code": skater.get("nationality_code"),
                    "organization_code": skater.get("organization_code"),
                    "thumbnail_image": skater.get("thumbnail_image"),
                    "status": skater.get("status"),
                    "created_at": skater.get("created_at"),
                    "updated_at": skater.get("updated_at"),
                    "discipline": skater.get("discipline", {}).get("title"),
                    "is_favourite": skater.get("is_favourite"),
                    "results": skater.get("results"),
                    "details": skater.get("details", {})
                }
    return {"error": "No skater found."}

if __name__ == "__main__":
    SKATERS_DATA = load_skaters_data("bio_skaters/few_skaters.ndjson")

    MODEL_NAME = "qwen-plus"
    API_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    API_KEY = os.getenv("API_KEY")

    model = ChatOpenAI(model=MODEL_NAME,
                       base_url=API_BASE_URL,
                       api_key=API_KEY)

    agent = create_agent(model,
                         tools=[get_skater_info],
                         system_prompt="You are a helpful assistant specialized in short track speed skating. You can call tools to get factual information about a skater by giving the name of the skater or to get information about a specific race.")

    # retrieve description for a skater
    skater_name = SKATERS_DATA[3].get("first_name"), SKATERS_DATA[3].get("last_name")

    result_skater = agent.invoke({
        "messages": [
            {"role": "user", "content": f"Your task is to write a text of about 5 sentences about the skater named {skater_name[0]} {skater_name[1]}. If some information is missing, do not make anything up. I would like to have a general summary of this athlete (including sporting achievements), but also any unusual information."}]
    })

    # FIXME : print only result
    print(result_skater)

    # retrieve description for a race
    # TODO
