import argparse
import os

import yt_dlp

DOWNLOAD_ROOT = os.path.join(os.environ.get("HOME", "."), "Videos")

# 720p webm, no audio
# We need a good enough resolution to read the text properly
# Find using `yt-dlp `
FORMAT_IDS = "248,303,247,302"


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
        "--formats",
        "-f",
        default=FORMAT_IDS,
        help="',' separated list of formats in the order of preference. Run 'yt-dlp --list-formats <url>' "
        f"to get a list of supported formats for a video. Default={FORMAT_IDS}",
        type=str,
    )

    args = parser.parse_args()

    args.urls = args.urls.split(",")
    args.formats = args.formats.split(",")
    args.output_dir = os.path.abspath(args.output_dir)

    return args


if __name__ == "__main__":
    args = parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    for url in args.urls:
        for format in args.formats:
            try:
                params = {
                    "format": str(format),
                    "outtmpl": os.path.join(args.output_dir, "%(id)s_%(title)s.%(ext)s"),
                }

                with yt_dlp.YoutubeDL(params) as ydl:
                    ydl.download([url])
                    break
            except:
                continue
