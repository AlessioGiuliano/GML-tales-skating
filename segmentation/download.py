import argparse
import os

import yt_dlp

DOWNLOAD_ROOT = os.path.join(os.environ.get("HOME", "."), "Videos")

URLS = ["https://www.youtube.com/watch?v=GEsS5ZBIQN0"]

# 720p webm, no audio
# We need a good enough resolution to read the text properly
FORMAT_ID = "302"


def parse_args():
    parser = argparse.ArgumentParser("Youtube videos downloader")
    parser.add_argument(
        "urls",
        help="A ',' separated list of video URLs to download.",
        type=str,
    )
    parser.add_argument(
        "--output_dir",
        "-o",
        default=DOWNLOAD_ROOT,
        help=f"Directory where to store downloaded videos. Default={DOWNLOAD_ROOT}",
        type=str,
    )
    parser.add_argument(
        "--format",
        "-f",
        default=FORMAT_ID,
        help="The format ID to download. Run 'yt-dlp --list-formats <url>' "
        "to get a list of supported formats for a video. Default=302 (720p webm)",
        type=str,
    )

    args = parser.parse_args()
    args.urls = args.urls.split(",")

    return args


if __name__ == "__main__":
    args = parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    params = {
        "format": str(args.format_id),
        "outtmpl": os.path.join(args.output_dir, "%(id)s_%(title)s.%(ext)s"),
    }

    with yt_dlp.YoutubeDL(params) as ydl:
        ydl.download(URLS)
