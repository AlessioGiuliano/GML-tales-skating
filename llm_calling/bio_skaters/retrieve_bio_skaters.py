# from https://medium.com/garantibbva-teknoloji/understanding-llm-tool-calling-traditional-vs-embedded-approaches-fc7e576d05de

# TODO : for the moment, skater retrieved only if exact match for first name and last name -> to improve

import openai
import json
import os

# Tool library class to manage and execute tools
class ToolLibrary:
    def __init__(self):
        # TODO : test with small file
        self.skaters = self.load_skaters_data("./few_skaters.ndjson")

        self.tools = {
            "get_skater_info": {
                "function": self.get_skater_info,
                "description": "Retrieve info about a specific skater by first and/or last name",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "first_name": {"type": "string", "description": "The first name of the skater"},
                        "last_name": {"type": "string", "description": "The last name of the skater"}
                    },
                    "required": ["last_name"]
                }
            }
        }

    def load_skaters_data(self, filepath):
        data = []
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    data.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
        return data

    def get_skater_info(self, first_name="", last_name=""):
        for skater in self.skaters:
            if (skater.get("last_name").lower() == last_name.lower() and (first_name == "" or skater.get("first_name").lower() == first_name.lower())):
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
        return {"error": f"No skater found for {first_name} {last_name}"}

    def get_tool_definition(self, tool_name):
        if tool_name in self.tools:
            return {
                "type": "function",
                "function": {
                    "name": tool_name,
                    "description": self.tools[tool_name]["description"],
                    "parameters": self.tools[tool_name]["parameters"]
                }
            }
        return None

    def execute_tool(self, tool_name, arguments):
        if tool_name in self.tools:
            args = json.loads(arguments) if isinstance(arguments, str) else arguments
            # TODO : need to modify this line if more tools
            return self.tools[tool_name]["function"](first_name=args.get("first_name", ""), last_name=args.get("last_name", ""))
        return "Invalid tool call"

# Main class to handle embedded tool calling
class EmbeddedToolCaller:
    def __init__(self, api_key, base_url):
        self.client = openai.OpenAI(api_key=api_key, base_url=base_url)
        self.tool_library = ToolLibrary()

    def process_message(self, user_message):
        # Step 1: Client sends message to the library
        print(f"Client message: {user_message}")

        # Step 2: Library appends tool definitions and sends to LLM
        tool_definitions = [self.tool_library.get_tool_definition("get_skater_info")]
        initial_response = self.client.chat.completions.create(
            model="qwen-plus",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specialized in short track speed skating. You can call tools to get factual information about individual skaters by giving the name of the skater."},
                {"role": "user", "content": user_message}
            ],
            tools=tool_definitions,
            tool_choice="auto"
        )

        message = initial_response.choices[0].message
        print(f"LLM initial response: {message}")

        # Step 3: LLM selects tool (but doesn't execute it)
        if hasattr(message, 'tool_calls') and message.tool_calls:
            tool_call = message.tool_calls[0]
            tool_name = tool_call.function.name
            arguments = tool_call.function.arguments

            # Step 4: Library executes the tool call and retrieves response
            tool_response = self.tool_library.execute_tool(tool_name, arguments)
            print(f"Tool response: {tool_response}")

            # Step 5: Pass tool response back to LLM for final answer
            final_response = self.client.chat.completions.create(
                model="qwen-plus",
                messages=[
                    # TODO : context can be modified (maybe reduce the length of output)
                    {"role": "system", "content": "Your task is to write a text of about 10 sentences about the skater mentioned. If some information is missing, do not make anything up. I would like to have a general summary of this athlete (including sporting achievements), but also any unusual information."},
                    {"role": "user", "content": user_message},
                    {"role": "assistant", "content": message.content, "tool_calls": message.tool_calls},
                    {"role": "tool", "content": json.dumps(tool_response), "tool_call_id": tool_call.id}
                ]
            )
            final_message = final_response.choices[0].message
            print(f"LLM final answer: {final_message.content}")
            return final_message.content

        # If no tool call, return the LLM's direct response
        return message.content

if __name__ == "__main__":
    api_key = os.getenv("API_KEY")
    base_url = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    tool_caller = EmbeddedToolCaller(api_key, base_url)

    # Example client message
    # TODO : question hard coded
    user_input = "Please provide me with all the information you have about the Swiss short track speed skater named Thibault Metraux."
    result = tool_caller.process_message(user_input)
    print(f"Final result: {result}")
