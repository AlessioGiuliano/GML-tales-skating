import logging

import requests
from bs4 import BeautifulSoup


class SkaterPageScraper:
    _BASE_URL = 'https://isu-skating.com/short-track/skaters'

    def _fetch(self, slug: str) -> BeautifulSoup:
        url = f'{self._BASE_URL}/{slug}/'
        logging.debug(f'Fetching skater page for {slug}')
        response = requests.get(url)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')

    @staticmethod
    def _to_key(val: str) -> str:
        return val.strip().lower().replace(' ', '_').replace('/', '')

    def scrape(self, slug: str) -> dict[str, str]:
        logging.info(f'Scraping skater page for {slug}')
        soup = self._fetch(slug)

        base_attributs_section = soup.select_one('.skating-hero-bottom')

        base_attributs = {
            self._to_key(attr.select_one('.text-primary').getText()): attr.select_one('.text-base').getText()
            for attr in base_attributs_section.select('.flex')
        }

        additional_attributs_section = soup.select_one('.documents-tab-section')

        # not defined for all
        if additional_attributs_section is None:
            return base_attributs

        additional_attributs = {
            self._to_key(attr.select_one('.text-secondary').getText()): attr.select_one('.overflow-hidden').getText()
            for attr in additional_attributs_section.select('.accordian-box')
        }
        return {**base_attributs, **additional_attributs}
