import argparse
from glob import glob
import json
import os
import subprocess


COMMAND_PATTERN = 'yt-dlp --download-sections "*{start_h}:{start_m}:{start_s}-{end_h}:{end_m}:{end_s}" -f "(bestvideo+bestaudio/best)[protocol!*=dash]" "https://www.youtube.com/watch?v={video_id}" --output "{race_id}"'

def parse_args():
    parser = argparse.ArgumentParser("Dwonload splitted video according to extracted races")

    parser.add_argument("--input-dir", "-i")


    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    commands = list()

    for path in glob(os.path.join(args.input_dir, "*_ground_truth.json")):
        with open(path, "r") as file:
            races = json.load(file)

            for id, race in races.items():
                start = race["start"]
                end = race["end"]

                command = COMMAND_PATTERN.format_map({
                    "start_h": int(start / 3600),
                    "start_m": int((start % 3600) / 60),
                    "start_s": (start % 60),
                    "end_h": int(end / 3600),
                    "end_m": int((end % 3600) / 60),
                    "end_s": (end % 60),
                    "video_id": os.path.basename(path).split("_")[0],
                    "race_id": id
                })
                commands.append(command)


    with open("download_script.sh", "w") as file:
        for command in commands:
            file.write(f"{command}\n")
