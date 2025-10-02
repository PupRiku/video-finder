from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
# import os
import json
import requests
import io
from scraper import scrape_page_data

# --- App & AI Model Setup ---
app = Flask(__name__)
CORS(app)

# Configuration
INDEX_FILE = 'video_index.faiss'
FRAME_MAP_FILE = 'frame_map.json'
TOP_K = 3

# Load the AI model and FAISS index when the server starts
print("Loading AI model and local search index...")
model = SentenceTransformer('clip-ViT-B-32')
index = faiss.read_index(INDEX_FILE)
with open(FRAME_MAP_FILE, 'r') as f:
    local_frame_map = json.load(f)
print("Model and local index loaded successfully.")


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
    return "<p>Hello, World! Our server is running.</p>"


@app.route('/search_local', methods=['POST'])
def search_endpoint():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided..."}), 400

    image_file = request.files['image']

    try:
        query_image = Image.open(image_file.stream)
        query_embedding = model.encode(
            [query_image],
            convert_to_tensor=True,
            show_progress_bar=False
        )
        faiss.normalize_L2(query_embedding.cpu().numpy())
        distances, indices = index.search(query_embedding.cpu().numpy(), TOP_K)
        results = []
        for i, idx in enumerate(indices[0]):
            frame_data = local_frame_map[idx]
            result = {
                "rank": i + 1,
                "filename": frame_data["frame_path"],
                "video_source": frame_data["video_source"],
                "timestamp": frame_data["timestamp"],
                "distance": float(distances[0][i])
            }
            results.append(result)

        return jsonify(results)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred during search"}), 500


@app.route('/scrape_and_search', methods=['POST'])
def scrape_and_search_endpoint():
    if 'image' not in request.files or 'target_url' not in request.form:
        return jsonify({"error": "Missing image or target_url"}), 400

    image_file = request.files['image']
    target_url = request.form['target_url']

    # Scrape the target URL
    scrapped_data = scrape_page_data(target_url)
    if not scrapped_data:
        return jsonify({
            "error": "Failed to scrape or no images found on URL"
        }), 500

    # Download thumbnails and create embeddings
    thumbnail_embeddings = []
    valid_thumbnails = []
    for item in scrapped_data:
        thumbnail_img = download_image(item['thumbnail_url'])
        if thumbnail_img:
            embedding = model.encode(
                [thumbnail_img],
                convert_to_tensor=True
            )
            thumbnail_embeddings.append(embedding.cpu().numpy())
            valid_thumbnails.append(item)

    if not thumbnail_embeddings:
        return jsonify({
            "error": (
                "Could not download or process any thumbnails from the URL."
            )
        }), 500

    # Build a temporary in-mamory index
    embeddings_array = np.vstack(thumbnail_embeddings)
    faiss.normalize_L2(embeddings_array)
    temp_index = faiss.IndexFlatIP(embeddings_array.shape[1])
    temp_index.add(embeddings_array)

    # Create embedding for the user's uploaded image and search
    query_image = Image.open(image_file.stream)
    query_embedding = model.encode([
        query_image],
        convert_to_tensor=True
    )
    faiss.normalize_L2(query_embedding.cpu().numpy())
    distances, indices = temp_index.search(
        query_embedding.cpu().numpy(), TOP_K
    )

    # Format and return results
    results = []
    for i, idx in enumerate(indices[0]):
        item = valid_thumbnails[idx]
        result = {
            "rank": i + 1,
            "page_url": item["page_url"],
            "thumbnail_url": item["thumbnail_url"],
            "distance": float(distances[0][i])
        }
        results.append(result)

    return jsonify(results)


@app.route('/frames/<path:filename>')
def serve_frame(filename):
    return send_from_directory('frames', filename)


if __name__ == '__main__':
    app.run(debug=False, port=5000)
