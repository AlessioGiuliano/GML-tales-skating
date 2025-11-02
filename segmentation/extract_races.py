import argparse
from collections import defaultdict
from dataclasses import dataclass
import csv
import os
import re

from pprint import pprint

def parse_args():
    cwd = os.getcwd()
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_dir", "-i", default=cwd)
    parser.add_argument("--output_dir", "-o", default=cwd)

    return parser.parse_args()


def frame_idx_to_timestamp(idx):
    fps = 60
    return int(idx / fps)


@dataclass
class Race():
    start: int | None= None
    end: int | None= None

if __name__ == "__main__":
    args = parse_args()

    for file in os.listdir(args.input_dir):
        if not os.path.splitext(file)[1] == ".csv":
            continue

        path = os.path.join(args.input_dir, file)
        video_id = file[: file.find("_")]

        races = defaultdict(Race)

        pattern = r"(?P<category>(men|women)(.)*)(\s*)-(\s*)(?P<info_type>(start list|result))(\s*)-(\s*)(?P<race>(.)*)"

        regex = re.compile(pattern)
        with open(path, "r") as file:
            reader = csv.DictReader(file)
            print(reader.fieldnames)

            expected_info = "start list"
            race = None

            for line in reader:
                idx = int(float(line["frame_idx"]))
                timestamp = frame_idx_to_timestamp(idx)

                text = line["text"].lower()
                match = regex.search(text)

                if match is not None:
                    race = f"{match.group("category")}-{match.group("race")}"
                    if match.group("info_type") == "start list":
                        races[race].start = timestamp
                    else:
                        races[race].end = timestamp


        pprint(races)
