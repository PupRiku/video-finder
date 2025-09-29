# Changelog

## v0.4.0 - Full-Stack Application Complete

- Developed a frontend UI using Next.js and React.
- Styled the application with a Neo-Brutalist aesthetic using Tailwind CSS.
- Implemented a file upload component with image preview.
- Connected the frontend to the backend API to send images and receive results.
- Handled UI states for loading, errors, and displaying search results.
- Resolved CORS issues to enable communication between the frontend and backend servers.

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
