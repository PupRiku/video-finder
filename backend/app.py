from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import faiss
from sentence_transformers import SentenceTransformer
# import numpy as np
# import os
import json

# --- App & AI Model Setup ---
app = Flask(__name__)
CORS(app)

# Configuration
INDEX_FILE = 'video_index.faiss'
FRAME_MAP_FILE = 'frame_map.json'
TOP_K = 5

# Load the AI model and FAISS index when the server starts
print("Loading AI model and search index...")
model = SentenceTransformer('clip-ViT-B-32')
index = faiss.read_index(INDEX_FILE)

# Updated logic to load the new JSON frame map
with open(FRAME_MAP_FILE, 'r') as f:
    frame_map = json.load(f)

print("Model and index loaded successfully.")


# --- API Endpoints ---
@app.route('/')
def hello_world():
    return "<p>Hello, World! Our server is running.</p>"


@app.route('/search', methods=['POST'])
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
        distances, indices = index.search(query_embedding.cpu().numpy(), TOP_K)

        # Updated logic to create a more detailed results object
        results = []
        for i, idx in enumerate(indices[0]):
            frame_data = frame_map[idx]
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


if __name__ == '__main__':
    app.run(debug=False, port=5000)
