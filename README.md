# AI Video Finder

This project is a proof of concept for an AI-powered search engine that can find the source video and timestamp of a specific moment using only a screenshot.

## Current Status: Proof of Concept (PoC)

The project is currently a set of Python scripts that demonstrate the core functionality:

- **Frame Extraction:** Processes a local video file and extracts frames at a set interval.
- **AI Indexing:** Uses the CLIP `ViT-B-32` model to create vector embeddings for each frame and stores them in a highly-efficient FAISS index.
- **Image Search:** Takes a query image, creates an embedding for it, and searches the FAISS index to find the most visually similar frames from the source video.

## How to Run

### 1. Setup

First, install the required Python libraries:

```sh
pip install opencv-python torch sentence-transformers faiss-cpu Pillow
```

### 2. Index a Video

1. Place a video file (e.g., `test_video.mp4`) into the `videos/` directory.
2. Update the `VIDEO_PATH` variable in `main.py` to match your video's filename.
3. Run the indexing script:

```sh
python main.py
```

This will create a `frames/` folder with the video's frames and generate `video_index.faiss` and `frame_map.txt` files.

### 3. Search for an Image

1. Find an image you want to search for (a good test is to use an image from the `frames/` folder).
2. Run the search script, passing the path to your image as an argument:

```sh
python search.py path/to/your/image.jpg
```

The script will print the top 3 most similar frames found in the video index.
