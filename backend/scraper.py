import requests
from bs4 import BeautifulSoup
import urllib.parse


def scrape_page_data(url):
    """
    Visits a URL and scrapes a list of dictionaries, each containing
    a page link and its corresponding thumbnail image URL
    """
    try:
        print(f"Fetching content from: {url}")
        headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/91.0.4472.124 Safari/537.36'
            )
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all thumbnail images
        image_tags = soup.find_all('img', class_='thumbnail')
        print(f"Found {len(image_tags)} matching image tags.")

        scraped_data = []
        for img_tag in image_tags:
            # Find the parent 'a' tag to get the page link
            parent_link = img_tag.find_parent('a')
            if parent_link and parent_link.has_attr('href'):
                page_url = urllib.parse.urljoin(url, parent_link['href'])
                img_src = img_tag.get('src', '')
                thumbnail_url = urllib.parse.urljoin(url, img_src)

                scraped_data.append({
                    'page_url': page_url,
                    'thumbnail_url': thumbnail_url
                })

        return scraped_data

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


# --- Example Usage ---
if __name__ == "__main__":
    # We'll use a simple, predictable page for our first test
    test_url = "https://books.toscrape.com/"
    found_data = scrape_page_data(test_url)

    if found_data:
        print(f"\n--- Found {len(found_data)} Items ---")
        for i, item in enumerate(found_data):
            print(
                f"{i+1}: Page: {item['page_url']} | "
                f"Thumbnail: {item['thumbnail_url']}"
            )
