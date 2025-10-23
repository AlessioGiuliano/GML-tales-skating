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

## Description based on json file

Race *Men 500 m / Finals / Final A* to be easily compared to the video.

### First test

#### Prompt

```
Your task is to provide me with specific information about the short track speed skating race for the {discipline_name} discipline during the {round_name} round and the {heat_name} heat. I want to know: the final ranking, which athletes competed, and the performance of each athlete during the race.
```

#### Result

```
Here is the detailed information about the **Men's 500 m Final A** race:\n\n### **Final Ranking and Competitors:**\n1. **Gold (1st):**  \n   - **Bib Number:** 2  \n   - **Final Time:** **41.124 seconds**  \n   - **Lap Times:**  \n     - Lap 1: 6.690 s  \n     - Lap 2: 9.070 s  \n     - Lap 3: 8.380 s  \n     - Lap 4: 8.380 s  \n     - Lap 5: 8.604 s  \n\n2. **Silver (2nd):**  \n   - **Bib Number:** 3  \n   - **Final Time:** **41.183 seconds** (+0.059 behind gold)  \n   - **Lap Times:**  \n     - Lap 1: 6.800 s  \n     - Lap 2: 9.180 s  \n     - Lap 3: 8.580 s  \n     - Lap 4: 8.200 s  \n     - Lap 5: 8.423 s  \n\n3. **Bronze (3rd):**  \n   - **Bib Number:** 11  \n   - **Final Time:** **41.354 seconds** (+0.230 behind silver)  \n   - **Lap Times:**  \n     - Lap 1: 7.130 s  \n     - Lap 2: 8.960 s  \n     - Lap 3: 16.830 s (slowed significantly)  \n     - Lap 4 & 5: Combined time of 8.434 s (missing intermediate lap data)  \n\n4. **4th Place:**  \n   - **Bib Number:** 46  \n   - **Final Time:** **41.631 seconds** (+0.507 behind bronze)  \n   - **Lap Times:**  \n     - Lap 1: 6.810 s  \n     - Lap 2: 9.480 s  \n     - Lap 3: 8.650 s  \n     - Lap 4: 8.260 s  \n     - Lap 5: 8.431 s  \n\n5. **Penalty (Did Not Finish Officially):**  \n   - **Bib Number:** 18  \n   - **Result:** **PEN (Penalty)**  \n   - No lap times recorded due to disqualification.\n\n### **Race Summary:**\n- The race was extremely close, with the top three skaters separated by just **0.230 seconds**.\n- The winner maintained a strong and consistent pace throughout, leading from the start.\n- Bib 11 had a significant slowdown in Lap 3 but managed to recover for bronze.\n- Bib 18 was penalized, likely due to a rules violation (e.g., false start, obstruction).\n\nFor visual confirmation, you can view the [photo finish here](https://archive.isu.swisstiming.com/api-general/v1/photo-finish/?sourceId=d05c7f68-81f9-46a5-b1b5-aff49218b124).
```

### Second test

#### Prompt

```
You are an amazing sportscaster dedicated to describing the short track speed skating race for the {discipline_name} discipline during the {round_name} round and the {heat_name} heat. You will briefly give the ranking (e.g., 1. athlete name (time, gap with the athlete just before), 2. ...) and describe the race (overtakes, falls, accelerations, penalties, whether the ranking was decided from the start or remained extremely close until the end, etc.).
```

#### Result

```
Ladies and gentlemen, what a thrilling Final A in the Men's 500 meters here at the ISU World Cup!
The tension was palpable from the very first stride, and the race delivered on every front—explosive starts, razor-thin margins, and high drama.
Let’s break down the final ranking:
1. **Steven (41.124)** – A masterclass in consistency and control. Steven seized the lead right from the start and never looked back. Clocking lap times of 6.690, 9.070, 8.380, 8.380, and a strong 8.604 on the final lap, he maintained clean lines and perfect balance through each turn. His dominance was clear early—he led every single lap, building a small but steady gap.
2. **William (+0.059, 41.183)** – Just shy of gold, William skated a technically superb race. Starting from lane 4, he quickly found his rhythm, matching Steven’s pace closely. His best moment came on lap 4 when he recorded an 8.200 split—the fastest of the field that lap—narrowing the gap. He finished with a 8.423 final lap, nearly pulling off a last-corner surge, but Steven held firm.
3. **Pietro (+0.230, 41.354)** – A rollercoaster performance from Pietro. He started poorly, trailing in fifth after the first corner with a 7.130 opening lap. However, he mounted a stunning mid-race recovery, using a blistering third lap of 16.830 (which likely includes a full pass or two) to climb back into contention. Though one lap time appears anomalous—possibly due to a drafting maneuver or data glitch—his determination earned him the bronze.
4. **Shogo (+0.507, 41.631)** – Solid but unspectacular. Shogo began well in lane 3 but lost crucial ground in the second lap, dropping to fifth momentarily. He fought hard to regain position, posting consistent splits, including an 8.260 on lap 4. Ultimately, he couldn’t close the gap on the podium trio.
And heartbreak for **Michal**, who was shown a **penalty (PEN)**. While details aren’t fully clear, it appears he may have impeded another skater during a lane change or inside turn cut. No fall, no crash—but a costly infraction that ended his medal hopes.
**Race Summary:**  \nThis wasn’t a race decided solely by raw speed—it was a chess match on blades. Steven’s flawless execution from lane 1 set the tone. William pushed him to the limit, making it one of the closest 500m finishes of the season. Meanwhile, Pietro’s comeback and Michal’s penalty added layers of drama. In the end, precision, patience, and poise under pressure crowned the champion.\n\nWhat a finish—short track at its finest!",
```

### Third test

#### Prompt

```
You are a sportscaster dedicated to describing the short track speed skating race for the {discipline_name} discipline during the {round_name} round and the {heat_name} heat. You will briefly give the ranking (e.g., 1. athlete name (time, gap with the athlete just before), 2. ...) and describe the race (overtakes, falls, accelerations, penalties, whether the ranking was decided from the start or remained extremely close until the end, etc.). Keep it simple (raw text), and maximum 10 lines.
```

#### Result

```
1. Steven (41.124)  \n2. William (+0.059)  \n3. Pietro (+0.230)  \n4. Shogo (+0.507)  \n5. Michal (PEN)
Steven took the lead from the start and held it cleanly. William advanced from fourth to second with a strong final lap. Pietro surged late after a slow start, overtaking Shogo mid-race. Shogo faded slightly but finished fourth. Michal was penalized, likely for a lane violation or contact. The top three battled closely, with just 0.23 seconds separating them.
```
