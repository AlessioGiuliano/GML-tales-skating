from argparse import ArgumentParser
import csv
import os
import json


def parse_args():
    parser = ArgumentParser("Convert a JSON file provided by ISU to a tabular CSV format")

    parser.add_argument("json_path", help="The path to the JSON file to convert", type=str)

    parser.add_argument("--out_dir", "-o", help="The output directory of the resulting CSV files", type=str, default=os.getcwd())


    return parser.parse_args()


def make_valid_json(json_: str) -> str:
    # The provided JSON document is not valid, it seems
    # to be part of a missing outer JSON object
    return "{" + json_.rstrip(",") + "}"


if __name__ == "__main__":
    args = parse_args()

    with open(args.json_path, "r") as file:
        content = json.loads(make_valid_json(file.read()))

    if content.get("Data") is None:
        print("Could not find Data key in provided JSON")
        exit(1)


    output_path = os.path.splitext(os.path.basename(args.json_path))[0].replace(" ", "_")

    with open(f"{output_path}_race_results.csv", "w") as file:
        competitors_data = dict()

        fieldnames = list()

        for competitor in content["Data"].get("Competitors", []):
            competitor_id = competitor["Id"]
            person = competitor.get("Competitor").get("Person")

            competitor_data = {
                "PersonId": person["Id"],
                "CompetitorId": competitor_id,
                "FirstName": person["FirstName"],
                "LastName": person["LastName"],
                "Gender": person["Gender"],
                "OrganizationCode": person["OrganizationCode"],
                "DateOfBirth": person["DateOfBirth"]["Date"],
                "NationalFederationCode": competitor.get("StartedForNfCode"),
                "NationalFederationName": competitor.get("StartedForNfName"),
                "NationalFederationCountryName": competitor.get("StartedForNfCountryName"),
            }

            if len(fieldnames) == 0:
                fieldnames = list(competitor_data.keys())

            competitors_data[competitor_id] = competitor_data

        results = list()
        # Keep track of the max number of laps per heat to properly set CSV header
        max_n_laps = None

        lap_keys = set()

        for round in content["Data"].get("Rounds", []):
            round_data = {
                "RoundName": round["Name"],
                "RoundStartDate": round["Start"]["Date"],
            }
            for heat in round["Heats"]:
                heat_data = {
                    **round_data,
                    "HeatId": heat["Id"],
                    "HeatName": heat["Name"],
                    "HeatStartDate": heat["Start"]["Date"],
                }
                for competitor in heat["Competitors"]:
                    competitor_data = competitors_data[competitor["CompetitionCompetitorId"]]
                    result_data = {
                        **competitor_data,
                        **heat_data,
                        "StartingPosition": competitor["StartingPosition"],
                        "FinalRank": competitor["FinalRank"],
                        "FinalResult": competitor["FinalResult"],

                    }
                    laps = competitor["Laps"]
                    if max_n_laps is None:
                        max_n_laps = len(laps)
                    elif not len(laps) == max_n_laps:
                        print("Warning: Not all heats have the same number of laps, expect missing values in CSV")
                        max_n_laps = max(max_n_laps, len(laps))

                    for lap in laps:
                        number = int(lap["LapNumber"])
                        lap_data = {
                            f"Lap{number}Time": lap["LapTime"],
                            f"Lap{number}TotalTime": lap["Time"],
                            f"Lap{number}Rank": lap["Rank"],
                        }
                        result_data.update(lap_data)
                        lap_keys |= set(lap_data.keys())

                    results.append(result_data)

        fieldnames = list(results[0].keys())
        heats_csv = csv.DictWriter(file, fieldnames)
        heats_csv.writeheader()

        for heat in results:
            heats_csv.writerow(heat)




