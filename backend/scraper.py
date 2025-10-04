import requests
from bs4 import BeautifulSoup
import urllib.parse

SCRAPER_RULES = {
    'pornhub': {
        'find_all': ('a', {'class_': 'linkVideoThumb'}),
        'get_page_url': lambda tag: tag['href'],
        'get_thumbnail_url': lambda tag: tag.find('img')['src']
    },
}


def scrape_page_data(url, site_key, max_pages=1):
    if site_key not in SCRAPER_RULES:
        return None

    rule = SCRAPER_RULES[site_key]
    all_scraped_data = []
    current_url = url

    for page_num in range(max_pages):
        if not current_url:
            break

        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(current_url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            tags = soup.find_all(rule['find_all'][0], **rule['find_all'][1])

            page_data = []
            for tag in tags:
                try:
                    page_url = urllib.parse.urljoin(
                        current_url,
                        rule['get_page_url'](tag)
                    )
                    get_thumb_func = rule.get(
                        'get_thumbnail_url', lambda t: t.get('src', '')
                    )
                    thumbnail_url = urllib.parse.urljoin(
                        current_url, get_thumb_func(tag)
                    )

                    if page_url and thumbnail_url:
                        page_data.append({
                            'page_url': page_url,
                            'thumbnail_url': thumbnail_url
                        })
                except (AttributeError, KeyError, TypeError):
                    continue

            all_scraped_data.extend(page_data)

            next_page_tag = None
            possible_links = soup.find_all('a', class_='orangeButton')
            for link in possible_links:
                if 'Next' in link.get_text():
                    next_page_tag = link
                    break

            if next_page_tag and next_page_tag.has_attr('href'):
                current_url = urllib.parse.urljoin(url, next_page_tag['href'])
            else:
                current_url = None

        except requests.exceptions.RequestException:
            break

    return all_scraped_data
