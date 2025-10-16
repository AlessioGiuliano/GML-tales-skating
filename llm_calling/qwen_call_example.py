import os
from openai import OpenAI

try:
    client = OpenAI(
        api_key=os.getenv("API_KEY"),
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )

    completion = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': 'Who are you?'}
            ]
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error message: {e}")
    print("For more information, see https://www.alibabacloud.com/help/en/model-studio/developer-reference/error-code")
