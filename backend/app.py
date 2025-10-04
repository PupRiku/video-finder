from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import requests
import io

from scraper import scrape_page_data

# --- App & AI Model Setup ---
app = Flask(__name__)
CORS(app)

# Configuration
TOP_K = 3

# Load the AI model and FAISS index when the server starts
print("Loading AI model...")
model = SentenceTransformer('clip-ViT-B-32')
print("Model loaded successfully.")


# --- Helper function to download an image from a URL ---
def download_image(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content))
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None


# --- API Endpoints ---
@app.route('/')
def hello_world():
    return "<p>Hello, World! The search server is running.</p>"


@app.route('/scrape_and_search', methods=['POST'])
def scrape_and_search_endpoint():
    if (
        'image' not in request.files or
        'target_url' not in request.form or
        'target_site' not in request.form
    ):
        return jsonify({
            "error": "Missing image, target_url, or target_site"
        }), 400

    image_file = request.files['image']
    target_url = request.form['target_url']
    site_key = request.form['target_site']
    num_pages = int(request.form.get('num_pages', 1))

    scraped_data = scrape_page_data(target_url, site_key, max_pages=num_pages)
    if not scraped_data:
        return jsonify({
            "error": "Failed to scrape or no images found on URL."
        }), 500

    thumbnail_embeddings = []
    valid_thumbnails = []
    for item in scraped_data:
        thumbnail_img = download_image(item['thumbnail_url'])
        if thumbnail_img:
            embedding = model.encode([thumbnail_img], convert_to_tensor=True)
            thumbnail_embeddings.append(embedding.cpu().numpy())
            valid_thumbnails.append(item)

    if not thumbnail_embeddings:
        return jsonify({
            "error": (
                "Could not download or process any thumbnails from the URL."
            )
        }), 500

    embeddings_array = np.vstack(thumbnail_embeddings)
    faiss.normalize_L2(embeddings_array)
    temp_index = faiss.IndexFlatIP(embeddings_array.shape[1])
    temp_index.add(embeddings_array)

    query_image = Image.open(image_file.stream)
    query_embedding = model.encode([query_image], convert_to_tensor=True)
    faiss.normalize_L2(query_embedding.cpu().numpy())
    distances, indices = temp_index.search(
        query_embedding.cpu().numpy(), TOP_K
    )

    results = []
    for i, idx in enumerate(indices[0]):
        item = valid_thumbnails[idx]
        result = {
            "rank": i + 1,
            "page_url": item['page_url'],
            "thumbnail_url": item['thumbnail_url'],
            "distance": float(distances[0][i])
        }
        results.append(result)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=False, port=5000)
