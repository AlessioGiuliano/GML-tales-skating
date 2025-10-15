import json
import logging
from typing import List

from isu_skater_scrapper.isu_api_client import ISUApiClient, SkaterListModel, SkaterResultModel
from isu_skater_scrapper.isu_skater_page_scrapper import SkaterPageScraper


class SkaterFullModel(SkaterListModel):
    results: List[SkaterResultModel]
    details: dict[str, str]


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)

    api_client = ISUApiClient()
    skater_page_scraper = SkaterPageScraper()

    count = 0

    with open('data.ndjson', 'w', encoding='utf-8') as f:
        for skater in api_client.list_skaters():
            completed_model: SkaterFullModel = skater
            completed_model['results'] = api_client.list_skater_results(skater['skaters_id'])
            completed_model['details'] = skater_page_scraper.scrape(skater['slug'])

            json.dump(completed_model, f)
            f.write('\n')
            f.flush()

            count += 1
            logging.info(f'Processed {count} Skaters')

    logging.info('Processed completed successfully')
