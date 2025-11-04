import argparse
from collections import defaultdict
from dataclasses import dataclass
import csv
import json
import os
import re
from datetime import datetime

from pprint import pprint
from dateutil import parser
from dateutil.relativedelta import relativedelta


def parse_args():
    cwd = os.getcwd()
    parser = argparse.ArgumentParser()

    parser.add_argument("--input_dir", "-i", default=cwd)
    parser.add_argument("--output_dir", "-o", default=cwd)
    parser.add_argument("--json", "-j")

    return parser.parse_args()


@dataclass
class Race:
    start: int | None = None
    end: int | None = None
    duration: int | None = None
    id: str | None = None


if __name__ == "__main__":
    args = parse_args()

    races = defaultdict(dict)

    for file in os.listdir(args.input_dir):
        if not os.path.splitext(file)[1] == ".json":
            continue

        try:
            with open(os.path.join(args.input_dir, file), "r") as f:
                competition_name = os.path.splitext(file)[0]
                json_string = f.read()
                # The provided data is not valid
                json_string = "{" + json_string.rstrip(",") + "}"
                event_data = json.loads(json_string)["Data"]
                event_name = event_data["Name"].lower()
                races[event_name] = defaultdict(dict)

                for race in event_data["Rounds"]:
                    round_name = race["Name"].lower()
                    races[event_name][round_name] = defaultdict(Race)
                    for heat in race["Heats"]:
                        heat_name = heat["Name"].lower()

                        def k(competitor):
                            string = competitor["FinalResult"]
                            # Weird hack to make string valid
                            if "." not in string:
                                string = "00.00"
                            while string.count(":") < 2:
                                string = "00:" + string

                            result = parser.parse(string, fuzzy=True)

                            return result

                        race_duration = max(heat["Competitors"], key=k)

                        race_duration = k(race_duration)

                        # Add margin
                        race_duration += relativedelta(seconds=30)
                        races[event_name][round_name][
                            heat_name
                        ].duration = race_duration

                        races[event_name][round_name][
                            heat_name
                        ].id = heat["Id"]

        except Exception as e:
            print(f"Error analyzing {file}: {e}")

    for file in os.listdir(args.input_dir):
        if not os.path.splitext(file)[1] == ".csv":
            continue

        path = os.path.join(args.input_dir, file)
        video_id = file[: file.find("_")]

        pattern = r"(?P<event>(men|women)(.)*)(\s*)-(\s*)(?P<info_type>(start list|result))(\s*)-(\s*)(?P<round>([a-z0-9])*)([\s-])*(?P<heat>((heat [0-9]*)|(.)*))"

        regex = re.compile(pattern)
        with open(path, "r") as file:
            reader = csv.DictReader(file)

            expected_info = "start list"
            race = None

            for line in reader:
                timestamp = int(float(line["timestamp"]))

                text = line["text"].lower()
                match = regex.search(text)

                if match is not None:
                    event_name = match.group("event").strip()
                    round_name = match.group("round").strip()
                    heat_name = match.group("heat").strip()

                    # Rename finals
                    if round_name == "final":
                        round_name = "finals"
                        heat_name = "final " + heat_name

                    if round_name not in races[event_name]:
                        races[event_name][round_name] = defaultdict(Race)

                    if match.group("info_type") == "start list":
                        races[event_name][round_name][heat_name].start = timestamp
                    else:
                        races[event_name][round_name][heat_name].end = timestamp

        result = dict()

        for event_name, event in races.items():
            for round_name, round in event.items():
                for heat_name, heat in round.items():
                    if not heat.id or ((not heat.start) and (not heat.end)):
                        print(f"Ignoring {heat}")
                        continue
                    if heat.duration is None and (
                        heat.start is None or heat.end is None
                    ):
                        continue

                    duration = 0
                    if heat.duration is not None:
                        duration = heat.duration.second + heat.duration.minute * 60

                    start = heat.start or heat.end - duration
                    end = heat.end or heat.start + duration

                    url = f"https://www.youtube.com/embed/{video_id}?start={int(start)}&end={int(end)}&autoplay=1"
                    result[heat.id] = url

        with open(f"{video_id}_races.json", "w") as file:
            json.dump(result, file, indent=4)
