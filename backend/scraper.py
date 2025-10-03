import requests
from bs4 import BeautifulSoup
import urllib.parse

SCRAPER_RULES = {
    'books_to_scrape': {
        'find_all': ('img', {'class_': 'thumbnail'}),
        'get_page_url': lambda tag: tag.find_parent('a')['href']
    },
    'pornhub': {
        'find_all': ('a', {'class_': 'linkVideoThumb'}),
        'get_page_url': lambda tag: tag['href'],
        'get_thumbnail_url': lambda tag: tag.find('img')['src']
    },
}


def scrape_page_data(url, site_key, max_pages=1):
    """
    Visits a URL and scrapes data, following pagination links
    for up to max_pages.
    """
    if site_key not in SCRAPER_RULES:
        print(f"Error: No scraper rule found for site key '{site_key}'")
        return None

    rule = SCRAPER_RULES[site_key]
    all_scraped_data = []
    current_url = url

    for page_num in range(max_pages):
        if not current_url:
            break

        print(f"\n--- Scraping Page {page_num + 1}: {current_url} ---")

        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(current_url, headers=headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            tags = soup.find_all(rule['find_all'][0], **rule['find_all'][1])
            print(f"Found {len(tags)} matching tags on this page.")

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
                except (AttributeError, KeyError, TypeError) as e:
                    print(f"Skipping a tag due to parsing error: {e}")
                    continue

            all_scraped_data.extend(page_data)

            # --- Find the next page link ---
            next_page_tag = None
            possible_links = soup.find_all('a', class_='orangeButton')
            for link in possible_links:
                # Check the visible text inside the link
                if 'Next' in link.get_text():
                    next_page_tag = link
                    break

            if next_page_tag and next_page_tag.has_attr('href'):
                current_url = urllib.parse.urljoin(url, next_page_tag['href'])
            else:
                print("No 'Next Page' link found. Ending scrape.")
                current_url = None

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            break

    return all_scraped_data


# --- Example Usage ---
if __name__ == "__main__":
    test_url = "https://www.pornhub.com/gay/video"
    found_data = scrape_page_data(test_url, 'pornhub', max_pages=3)

    if found_data:
        print(
            f"\n--- Scraped a total of {len(found_data)} Items "
            f"from 3 pages ---"
        )
        # Print first 5 for brevity
        for i, item in enumerate(found_data[:5]):
            print(f"{i+1}: Page: {item['page_url']}")
