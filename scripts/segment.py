import csv
import os
import pytz
import json

from argparse import ArgumentParser

import datetime
import dateutil
from dateutil import parser
from dateutil.relativedelta import relativedelta

from pprint import pprint

import yt_dlp

utc=pytz.UTC

CHANNEL = "https://www.youtube.com/@SkatingISU"

URL = "https://www.youtube.com/watch?v=GEsS5ZBIQN0"

def parse_args():
    parser = ArgumentParser("ISU Video segmentator", "Segment video from a given competition")

    parser.add_argument("csv", help="The CSV file path for the competition to segment.")

    return parser.parse_args()


def find_video_url(data) -> str:
    """
    Find the video matching CSV data from a competition.
    """
    # TODO
    params = {
    }
    with yt_dlp.YoutubeDL() as ydl:
        info = ydl.extract_info(CHANNEL, download=False)
        info = ydl.sanitize_info(info)

    return ""


def extract_heats(csv_path: str):
    heats = dict()

    with open(csv_path, "r") as file:
        reader = csv.DictReader(file)

        for row in reader:
            start = parser.parse(row["HeatStartDate"])
            start = start - relativedelta(hours=6)
            id = row["HeatId"]

            end = str(row["FinalResult"])
            try:
                # Make string parsable
                while end.count(":") < 2:
                    end = "00:" + end
                end = parser.parse(end) - relativedelta(hours=6)

            except:
                continue

            heat = (start,  end)
            if id in heats:
                if heats[id][1] < end:
                    heats[id] = heat
            else:
                heats[id] = heat

    return heats


def get_heat_start_offset(start_time, timestamp_to_offset):
    # Find chat message just before race start
    for timestamp in reversed(timestamp_to_offset.keys()):
        chat_time = datetime.datetime.fromtimestamp(int(int(timestamp) / (10 ** 6)))
        chat_time = utc.localize(chat_time)

        print(f"TS: {timestamp}")
        print(f"Chat time: {chat_time}")
        print(f"Start time: {start_time}")

        if chat_time > start_time:
            print("Continue")
            continue

        delta = start_time - chat_time
        print(f"Delta: {delta}")
        return datetime.timedelta(milliseconds=int(timestamp_to_offset[timestamp])) + delta

    return None


def segment_video(heat_starts: dict, video_urls: list[str], timestamp_to_offset: dict):
    infos = dict()
    for url in video_urls:
        with yt_dlp.YoutubeDL() as ydl:
            info = ydl.extract_info(url, download=False)
            info = ydl.sanitize_info(info)
            infos[url] = info

    result = dict()

    for heat_id, (heat_start, heat_end) in heat_starts.items():
        heat_end = datetime.timedelta(hours=heat_end.hour, minutes=heat_end.minute, seconds=heat_end.second, microseconds=heat_end.microsecond)
        for url, info in infos.items():
            video_start = datetime.datetime.fromtimestamp(info.get("timestamp"))
            video_start = utc.localize(video_start)
            print(f"Video start: {video_start}")

            video_duration = parser.parse(info.get("duration_string"))
            # FIXME: Ugly
            video_end = video_start + relativedelta(hours=video_duration.hour, minutes=video_duration.minute, seconds=video_duration.second)

            if (heat_start > video_start and heat_start < video_end):
                margin = datetime.timedelta(seconds=15)
                heat_start_offset = get_heat_start_offset(heat_start, timestamp_to_offset)
                if heat_start_offset is None:
                    continue
                heat_end_offset = heat_start_offset + heat_end + (margin * 4)

                result[heat_id] = f"https://www.youtube.com/embed/{info.get("display_id")}?start={int(heat_start_offset.total_seconds())}&end={int(heat_end_offset.total_seconds())}&autoplay=1"

    return result


def read_chat_data():
    with open("./seoul.live_chat.json", "r") as file:
        content = file.read()

        content = "[" + content + "]"
        content = content.replace("\n{", "\n,{")

        data = json.loads(content)

    timestamp_to_offset = dict()

    for item in data:
        item = item.get("replayChatItemAction", {})
        actions = item.get("actions", [])

        offset = item.get("videoOffsetTimeMsec")

        for action in actions:
            timestamp = (action
                         .get("addChatItemAction", {})
                         .get("item", {})
                         .get("liveChatTextMessageRenderer", {})
                         .get("timestampUsec")
            )
            if timestamp is not None:
                timestamp_to_offset[timestamp] = offset

    for ts, of in timestamp_to_offset.items():
        o = datetime.timedelta(milliseconds=int(of))
        print(f"TS: {datetime.datetime.fromtimestamp(int(ts) / 10 ** 6)} / Offset: {o}")
    return timestamp_to_offset


if __name__ == "__main__":
    args = parse_args()
    timestamp_to_offset = read_chat_data()

    heats = extract_heats(args.csv)

    # FIXME: Is there a way to find these automatically?
    # Seoul M
    video_urls = [
        # "https://www.youtube.com/watch?v=2V_s-Lyeqz4",
        "https://www.youtube.com/watch?v=GEsS5ZBIQN0",
        # "https://www.youtube.com/watch?v=oJZp5D10dig",
    ]

    embed_urls = segment_video(heats, video_urls, timestamp_to_offset)

    html = """
<html>
<body>
"""

    with open(args.csv, "r") as file:
        reader = csv.DictReader(file)
        for heat_id, url in embed_urls.items():
            for row in reader:
                if row.get("HeatId") == heat_id:
                    html += f"""
                        <h2>{row.get("RoundName")}</h2>
                        <h3>{row.get("HeatName")}</h3>
    <iframe width="1200" height="800" src="{url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        """
                    break


    html += """
        </body>
        </html>"""


    with open("index.html", "w") as file:
        file.write(html)

