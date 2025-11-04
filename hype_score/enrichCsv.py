"""
enrichCsv.py — enriches ISU short track CSVs with fall detection and hype score
"""

from typing import List, Dict, Any
import csv
import os
import pandas as pd
import hashlib
import argparse

CLOSE_FINISH_THRESHOLD = 0.15  # seconds
FALL_MULTIPLIER = 1.6
HYPE_WEIGHTS = {
    "falls": -1.0, # too many falls make the race less exciting
    "closeFinish": 2.5, # close finishes are interesting to watch, with a lot of suspense
    "leadChanges": 1.5, # each lead change adds excitement: for example when someone starts last and overtakes everyone
    "round": 1.0 # weight for the round (finals more exciting/memorable than heats)
    # TODO handle disqualification or penalties
}


def load_csv(file_path: str, sep: str = ","):
    """
    Loads the CSV file and returns a corresponding pandas dataframe
    """
    df = pd.read_csv(file_path, sep=sep)
    return df

# Using JSON: simply load the JSON in a dataframe, use a raceId and skip this function
# The dataframe should contain time in s and rank for each lap, in columns time_lap1, rank_lap1, time_lap2, rank_lap2, ...
# The final objective is to add a few pieces of information to each race: number of falls (possibly at which lap),
# whether there was a close finish, number of lead changes, and finally compute a hype score based on these elements.

def enrich_race_id(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds a new column RaceId to the dataframe, which is a unique numerical id computed from
    season-series-city-year-month-day-distance-round-group using a hash function.
    """
    keys = [
        "Season", "Series", "City", "Country", "Year",
        "Month", "Day", "Distance", "Round", "Group"
    ]
    def make_id(row):
        concat = "_".join(str(row[k]) for k in keys)
        return int(hashlib.sha1(concat.encode("utf-8")).hexdigest(), 16) % (10**10)
    df["RaceId"] = df.apply(make_id, axis=1)
    return df


def enrich_lap_times(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts time for each lap (1 to 5) from the columns time_lap1, time_lap2, ...time_lap5,
    which contain the time in seconds taken by each athlete for each lap.
    """
    for i in range(1, 6):
        col = f"time_lap{i}"
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def enrich_detect_falls(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds to dataframe 5 columns: FellLap1, FellLap2, ..., FellLap5
    Each column is a boolean indicating if a fall was detected in that lap.
    Also adds columns FallDetected (boolean)
    Heuristic for fall detection:
    - lap_i > FALL_MULTIPLIER * lap_{i-1} => probable fall. For lap 1, compare to lap 2
    """
    for i in range(1, 6):
        df[f"FellLap{i}"] = False

    for i in range(1, 6):
        prev_i = i - 1 if i > 1 else 2
        df[f"FellLap{i}"] = df.get(f"time_lap{i}") > FALL_MULTIPLIER * df.get(f"time_lap{prev_i}")

    df["FallDetected"] = df[[f"FellLap{i}" for i in range(1, 6)]].any(axis=1)
    df["FallsCount"] = df[[f"FellLap{i}" for i in range(1, 6)]].sum(axis=1)
    return df


def compute_close_finish(df: pd.DataFrame) -> pd.DataFrame:
    # Group by race, compute difference between 1st and 2nd times
    close_flags = []
    for race_id, g in df.groupby("RaceId"):
        g_sorted = g.sort_values("Time")
        close = False
        if len(g_sorted) >= 2:
            delta = g_sorted["Time"].iloc[1] - g_sorted["Time"].iloc[0]
            close = delta <= CLOSE_FINISH_THRESHOLD
        close_flags.extend([close] * len(g))
    df["CloseFinish"] = close_flags
    return df


def compute_lead_changes(df: pd.DataFrame) -> pd.DataFrame:
    # Count number of changes in leader across laps within each race
    lead_changes = []
    for race_id, g in df.groupby("RaceId"):
        leader_prev = None
        changes = 0
        for lap in range(1, 6):
            col = f"rank_lap{lap}"
            if col not in g.columns or g[col].isnull().all():
                continue
            leader_idx = g[col].idxmin()
            if pd.isna(leader_idx):
                continue
            leader_now = g.loc[leader_idx, "Name"]
            if leader_prev and leader_now != leader_prev:
                changes += 1
            leader_prev = leader_now
        lead_changes.extend([changes] * len(g))
    df["LeadChanges"] = lead_changes
    return df


def compute_hype_score(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute a hype score for each race:
    - First, group by race using race id
    Returns a new dataframe with an additional 'HypeScore' column: for that, multiply the total number of falls
    by the FALL_MULTIPLIER, add the number of lead changes multiplied by its weight, etc.
    """
    hype_scores = []
    for race_id, g in df.groupby("RaceId"):
        falls = g["FallDetected"].sum()
        close = g["CloseFinish"].any()
        lead_changes = int(g["LeadChanges"].iloc[0]) if "LeadChanges" in g.columns else 0
        round_factor = 1.0
        hype = (
            falls * HYPE_WEIGHTS["falls"] +
            (HYPE_WEIGHTS["closeFinish"] if close else 0) +
            lead_changes * HYPE_WEIGHTS["leadChanges"] +
            round_factor * HYPE_WEIGHTS["round"]
        )
        hype_scores.extend([hype] * len(g))
    df["HypeScore"] = hype_scores
    return df


def write_enriched_race_csv(df: pd.DataFrame, out_path: str):
    df.to_csv(out_path, index=False, header=True)

def main(input_csv: str, output_csv: str, sep: str = ","):
    df = load_csv(input_csv, sep=sep)
    df = enrich_race_id(df)
    df = enrich_lap_times(df)
    df = enrich_detect_falls(df)
    df = compute_close_finish(df)
    df = compute_lead_changes(df)
    df = compute_hype_score(df)
    write_enriched_race_csv(df, output_csv)
    print(f"Enriched file written to {output_csv}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nettoie un CSV produit avec un index en trop.")
    parser.add_argument("input", help="Chemin du fichier CSV d'entrée (ex: `input.csv`).")
    parser.add_argument("-o", "--output", required=True, help="Chemin du CSV de sortie (ex: `output.csv`).")
    parser.add_argument("--sep", default=",", help="Séparateur CSV (par défaut `,`).")
    args = parser.parse_args()
    main(args.input, args.output, args.sep)
