import {CompetitionData} from "./types";

export const fetchCompetitionData = (year: string, location: string, category: string): Promise<CompetitionData> => {
    return fetch(`http://localhost:8080/api/competitions/isu-world-tour/${year}/${location}/${category}`).then((response: Response) => response.json());
};