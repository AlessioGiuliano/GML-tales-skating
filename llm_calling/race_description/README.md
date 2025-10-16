# Description of each race

## Tests with one video

*Steven Dubois Wins in Dramatic Fashion _ 500m Men Final _ Tilburg 2025 _ #ShortTrackWorldTour* but simply called *video* to send to LLM

### Human description

- One skater takes the lead straight away
- Three skaters fall in a bend after about two laps, and they all return to the race
- Two first skaters very happy, as is the technical team
- Replay
  - Race for fallen skaters to regain their places
  - One skater gained a place after his fall (orange) and is very happy (he was pushed by another skater)

### ChatGPT description

#### Prompt

You are a sports commentator specialising in short track speed skating.
I would like you to analyse the video of the race, as well as the slow-motion replays and highlights, to extract the relevant information to communicate to the public, such as falls, overtaking manoeuvres, athletes' reactions, etc.
You should not take into account anything that is not related to the race (medal ceremonies, displaying the schedule for upcoming races or scores, ...).
Your description should be no more than 10 sentences long.

#### Result

- "Would you like the analysis to sound like a live commentary (energetic, present-tense, as if happening in real time) or more like a post-race analysis (objective, reflective tone)?"
- "both"
- "1. Visually analyse the race (detect falls, overtakes, gestures, etc.) directly from the footage / 2. Use only the audio commentary (if present) to infer what happens?"
- "1"
- "Would you like me to include the names or nationalities of skaters if visible on the suits or scoreboard, or keep the commentary generic?"
- "include it"
- "I don’t have the ability to watch or interpret the content of a video file directly."
- "nice..."

### Qwen3-Max description

#### Prompt

You are a sports commentator specialising in short track speed skating.
I would like you to analyse the video of the race, as well as the slow-motion replays and highlights, to extract the relevant information to communicate to the public, such as falls, overtaking manoeuvres, athletes' reactions, etc.
You should not take into account anything that is not related to the race (medal ceremonies, displaying the schedule for upcoming races or scores, ...).
Your description should be no more than 10 sentences long.

#### Result

In a dramatic Men's 500m Final A in Tilburg, Canada's Steven Dubois surged from the back to claim victory in 40.33 seconds after a chaotic pile-up eliminated several contenders early on. The race saw a major crash on the first turn involving Japan's Shaoang Liu and others, which cleared the path for Dubois and his teammate J. Pierre-Gilles. Dubois then executed a flawless final lap, overtaking the Dutch skater who had led for much of the race, while Pierre-Gilles secured second place. The Canadian duo celebrated their one-two finish with hugs on the ice before Dubois was officially awarded the gold medal, delighting the Canadian fans waving their flags in the stands.

#### Human analysis

- context of the race defined
- well-known athletes recognised
- details of the race almost correct (fall a little later than stated by llm)
- ceremony mentioned even though it was not the goal

## How to process in a Python script

1. Use Intelligent Media Processing (IMP) service from Alibaba Cloud to process video in frames (activation of Intelligent Media Services (IMS) on Alibaba Cloud done)
2. Use a LLM model to process frames in text
   - Tongyi Wanxiang = multimodal plateform of Alibaba Cloud : qwen-vl-plus-2025-01-25 (cheaper -> https://modelstudio.console.alibabacloud.com/?tab=doc#/doc/?type=model&url=2840914_2&modelId=qwen-vl-plus-2025-01-25)
   - qwen2.5-vl-72b-instruct (example how to use for video -> https://www.alibabacloud.com/help/en/model-studio/use-qwen-by-calling-api#513167d9c1eew / CTRL+F "video")
