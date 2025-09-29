from flask import Flask, request, jsonify
from PIL import Image
import faiss
from sentence_transformers import SentenceTransformer
# import numpy as np
# import os

# --- App & AI Model Setup ---
app = Flask(__name__)

# Configuration
INDEX_FILE = 'video_index.faiss'
FRAME_MAP_FILE = 'frame_map.txt'
TOP_K = 3  # Number of top results to return

# Load the AI model and FAISS index when the server starts
print("Loading AI model and search index...")
model = SentenceTransformer('clip-ViT-B-32')
index = faiss.read_index(INDEX_FILE)
with open(FRAME_MAP_FILE, 'r') as f:
    frame_map = [line.strip() for line in f.readlines()]
print("Model and index loaded successfully.")


# --- API Endpoints ---
@app.route('/')
def hello_world():
    return "<p>Hello, World! Our server is running.</p>"


@app.route('/search', methods=['POST'])
def search_endpoint():
    # 'request.files' is a dictionary containing all uploaded files.
    # We check if a file with the key 'image' was sent in the request.
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided..."}), 400

    image_file = request.files['image']

    try:
        # Process the uploaded image in memory without saving it
        query_image = Image.open(image_file.stream)

        # Create an embedding for the query image
        query_embedding = model.encode(
            [query_image],
            convert_to_tensor=True,
            show_progress_bar=False
        )

        # Perform the search
        distances, indices = index.search(query_embedding.cpu().numpy(), TOP_K)

        # Prepare the results
        results = []
        for i, idx in enumerate(indices[0]):
            result = {
                "rank": i + 1,
                "filename": frame_map[idx],
                "distance": float(distances[0][i])
            }
            results.append(result)

        # Return the results as JSON
        return jsonify(results)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred during search"}), 500


if __name__ == '__main__':
    # We set debug=False because the model loading takes time
    # and we don't want to reload it on every code change.
    app.run(debug=False, port=5000)
