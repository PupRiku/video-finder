# AI Video Finder

This project is an AI-powered search engine that can find the source video and timestamp of a specific moment using only a screenshot.

## Current Status: Backend Complete

The project currently consists of a Python backend powered by Flask.

- **Frame Extraction & Indexing:** A script (`main.py`) processes a local video file, extracts frames, and creates a searchable AI index using FAISS and the CLIP `ViT-B-32` model.
- **Search API:** A Flask server (`app.py`) exposes a `/search` endpoint that accepts an uploaded image, performs a similarity search against the index, and returns the top matches as a JSON response.

## How to Run

### 1. Setup

First, install the required Python libraries:

```sh
pip install Flask opencv-python torch sentence-transformers faiss-cpu Pillow
```

### 2. Index a Video

Before starting the server, you must have an indexed video.

1. Place a video file (e.g., `test_video.mp4`) into the `videos/` directory.
2. Run the indexing script:

```sh
python main.py
```

This will generate the `video_index.faiss` and `frame_map.txt` files required by the server.

### 3. Run the Backend Server

Start the Flask application server:

```sh
python app.py
```

The server will load the AI model and index, then start running on `http://127.0.0.1:5000`. The `/search` endpoint is now ready to accept POST requests with an image file.
