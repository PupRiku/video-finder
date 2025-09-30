# Changelog

## v0.7.0 - AI Similarity Logic Correction

- Corrected the core search logic to use a normalized `IndexFlatIP` (Inner Product) index, which is appropriate for the CLIP model.
- Rebuilt the indexing script and search API to correctly normalize all vectors, ensuring accurate similarity scores.
- Fixed the match percentage calculation on the frontend to correctly interpret the new inner product scores.
- Resolved a bug where real-world screenshots consistently showed a 0% match confidence.

## v0.6.0 - Visual Match Confidence

- Implemented a calculation to convert the AI model's "distance" score into a user-friendly percentage.
- Added color-coded badges to the UI for both video-level and frame-level results, dynamically changing from green to red based on match confidence.
- Refined the results layout to include the new percentage indicators.

## v0.5.0 - Multi-Video & Thumbnail Support

- Updated indexing script (`main.py`) to process an entire folder of videos.
- Switched from a simple text file to a structured `frame_map.json` to store detailed frame metadata (source video, timestamp, etc.).
- Implemented batch processing to handle indexing a large number of frames without memory errors.
- Added filename sanitization to prevent errors from special characters in video titles.
- Updated the Flask API (`app.py`) to serve frame images as static files.
- Enhanced the frontend to group search results by their source video.
- Added thumbnail images for each matched frame to the results display.

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
