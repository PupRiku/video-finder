import requests
from bs4 import BeautifulSoup
import urllib.parse


def scrape_image_urls(url):
    """
    Visits a URL, fetches its HTML content, and finds all image URLs.
    """
    try:
        # Step 1: Fetch the webpage content
        print(f"Fetching content from: {url}")
        # A 'User-Agent' header helps mimic a real web browser
        headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/91.0.4472.124 Safari/537.36'
            )
        }
        response = requests.get(url, headers=headers, timeout=10)

        # Raise an exception if the request failed (e.g., 404 not found)
        response.raise_for_status()

        # Step 2: Parse the HTML with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Step 3: Find all image tags
        image_tags = soup.find_all('img', class_='thumbnail')
        print(f"Found {len(image_tags)} matching image tags.")

        # Step 4: Extract and normalize image URLs
        image_urls = []
        for img_tag in image_tags:
            # The 'src' attribute contains the image URL
            src = img_tag.get('src')
            if src:
                # Convert relative URLs to absolute URLs
                absolute_url = urllib.parse.urljoin(url, src)
                image_urls.append(absolute_url)
        return image_urls

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


# --- Example Usage ---
if __name__ == "__main__":
    # We'll use a simple, predictable page for our first test
    test_url = "https://books.toscrape.com/"
    found_urls = scrape_image_urls(test_url)

    if found_urls is not None:
        print(f"\nFound {len(found_urls)} image URLs.")
        for i, url in enumerate(found_urls):
            print(f"{i+1}: {url}")
