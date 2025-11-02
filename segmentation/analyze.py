import argparse
import csv
import os
import subprocess

from concurrent.futures import ProcessPoolExecutor

import cv2
from PIL import Image
import pytesseract

VIDEO_EXTENSIONS = {
    ".mp4",
    ".webm",
}

def parse_args():
    cwd = os.getcwd()
    parser = argparse.ArgumentParser("Split ISU short track videos by race")
    parser.add_argument(
        "--input_dir",
        "-i",
        default=cwd,
        help=f"The input directory containing the races videos. Default={cwd}",
    )
    parser.add_argument(
        "--output_dir",
        "-o",
        default=cwd,
        help=f"The output directory where the resulting CSV file will be stored. Default={cwd}",
    )

    return parser.parse_args()


def extract_frames(video_path, video_width, video_height, base_fps, total_frames, interval_seconds=8):
    """
    Efficient frame extraction with FFMPEG
    """
    fps = 1.0 / interval_seconds
    cmd = [
        "ffmpeg",
        "-i",
        video_path,
        "-vf",
        f"fps={fps}",
        "-f",
        "image2pipe",
        "-pix_fmt",
        "rgb24",
        "-vcodec",
        "rawvideo",
        "-",
    ]

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    frame_size = video_width * video_height * 3

    frame_idx = 0
    frame_interval = base_fps / fps
    while True:
        data = process.stdout.read(frame_size)
        if len(data) < frame_size:
            break
        yield Image.frombytes("RGB", (video_width, video_height), data), frame_idx
        frame_idx += frame_interval
        if (frame_idx > total_frames):
            break

    process.wait()


def image_to_text(image, idx) -> str:
    print(f"Analyzing frame #{idx}")
    return pytesseract.image_to_string(image, lang="eng")


if __name__ == "__main__":
    args = parse_args()
    NUM_WORKERS = 10
    FRAME_INTERVAL_SECONDS = 8

    for file in os.listdir(args.input_dir):
        ext = os.path.splitext(file)[1]
        if not ext in VIDEO_EXTENSIONS:
            continue
        video_path = os.path.join(args.input_dir, file)

        # Extract some metadata before running ffmpeg + tesseract
        try:
            cap = cv2.VideoCapture(video_path)
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = total_frames / fps

            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            analyzed_frames = int(total_frames / fps / FRAME_INTERVAL_SECONDS)

            print(f"Analysing {file} | {total_frames} frames of {width}x{height}px")
            print(f"A total of {analyzed_frames} will be analyzed")
        except:
            continue

        results = list()
        with ProcessPoolExecutor(max_workers=NUM_WORKERS) as executor:
            # Submit frames as they're extracted
            futures = []
            for frame, frame_idx in extract_frames(
                video_path, width, height, fps, total_frames, FRAME_INTERVAL_SECONDS,
            ):
                future = executor.submit(image_to_text, frame, frame_idx)
                futures.append((future, frame_idx))

            # Collect results as they complete
            for future, frame_idx in futures:
                results.append((future.result(), frame_idx))


        # TODO: Compute correct timestamp
        timestamp = 0
        with open(os.path.join(args.output_dir, f"{file}.csv"), "w") as file:
            writer = csv.DictWriter(file, ["text", "timestamp"])
            writer.writeheader()

            for text, frame_idx in results:
                writer.writerow({
                    "text": text,
                    "timestamp": timestamp,
                })
