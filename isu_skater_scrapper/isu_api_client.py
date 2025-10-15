import logging
import time
from typing import List, TypedDict, Generator, TypeVar, Generic

import requests


class DisciplineModel(TypedDict):
    title: str
    image: str
    main_logo: str
    selected_logo: str
    unselected_logo: str


class SkaterListModel(TypedDict):
    skaters_id: int
    discipline_id: int
    api_id: str
    first_name: str
    last_name: str
    full_name: str
    gender: str
    nationality_code: str
    organization_code: str
    image: str
    thumbnail_image: str
    slug: str
    status: str
    created_at: str
    updated_at: str
    discipline: DisciplineModel
    discipline_title: str
    is_favourite: str


class SkaterResultModel(TypedDict):
    skaters_competition_results_id: int
    skaters_id: int
    event_name: str
    date: str
    year: str
    points: int
    rank: str
    category: str
    country: str
    event_type_name: str
    sport_code: str
    sport_name: str
    to_date: str
    created_at: str


class SkaterCompetitionParticipationModel(TypedDict):
    skaters_competition_results_id: int
    event_type_name: str


T = TypeVar("T")


class PaginatedResponseModel(TypedDict, Generic[T]):
    status: int
    message: str
    total_page: int
    current_page: int
    is_next_page: str
    total_items: int
    data: List[T]


class ISUApiClient:
    _GENERATOR_SLEEP_TIME = 0.15
    _SHORT_TRACK_ID = 3
    _BASE_URL = "https://api.isu-skating.com/api"

    def _post[T](self, path: str, params: dict) -> T:
        response = requests.post(f"{self._BASE_URL}{path}", data=params)
        response.raise_for_status()
        return response.json()

    def _retrieve_paginated(self, query) -> Generator:
        page = 1

        while True:
            logging.debug(f"Fetching list page: {page}")

            result: PaginatedResponseModel = query(page)

            yield from result['data']

            if result['is_next_page'] != 'Y':
                logging.debug("All data fetched")
                return

            # add sleep to avoid overloading the API
            time.sleep(self._GENERATOR_SLEEP_TIME)
            page += 1

    def list_skaters(self) -> Generator[SkaterListModel, None, None]:
        logging.info('Listing skaters')
        return self._retrieve_paginated(lambda page: self._post('/skater/list', {
            'discipline_id': self._SHORT_TRACK_ID,
            'page': page
        }))

    def _get_participated_events(self, skater_id: int) -> List[SkaterCompetitionParticipationModel]:
        logging.debug(f"Getting participated events for skater: {skater_id}")
        result = self._post('/skater/get-competition-results-eventtype', {
            'skaters_id': skater_id
        })

        return result['data']

    def list_skater_results(self, skater_id: int) -> List[SkaterResultModel]:
        logging.info(f"Listing skater results for: {skater_id}")
        participated_events = self._get_participated_events(skater_id)
        results = []

        for event in participated_events:
            event_results = list(self._retrieve_paginated(lambda page: self._post('/skater/get-competition-results', {
                'event_type_name': event['event_type_name'],
                'skaters_id': skater_id,
                'page': page
            })))

            results.extend(event_results)

        return results
