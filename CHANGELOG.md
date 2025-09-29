# Changelog

## v0.3.0 - Backend API Complete

- Created a Flask server in `app.py`.
- Implemented a `/search` API endpoint to handle image uploads.
- Integrated the core AI search logic directly into the Flask application.
- The server now loads the model and index on startup for efficient searching.

## v0.2.0 - Proof of Concept Complete

- Added `main.py` script to handle video processing.
- Implemented video frame extraction using OpenCV.
- Implemented AI indexing using SentenceTransformers (CLIP model) and FAISS.
- Added `search.py` script to perform similarity search against the index.
- Successfully demonstrated core functionality of finding a frame from a source video.

## v0.1.0: Project Setup

- Initialized Git repository.
- Created README, CHANGELOG, and LICENSE files.
