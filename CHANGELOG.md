# Changelog

## v1.0.0 - Official Release

- Packaged the frontend and backend into a single desktop application using Electron.
- Automated the startup and shutdown of the Python backend executable from the Electron main process.
- Implemented a startup loading screen to handle the backend's AI model initialization time, improving user experience.
- Fixed external links in the results to open in the user's default browser.
- Resolved complex, multi-day environment and versioning issues with Node.js and Electron to achieve a stable build.
- Finalized all code by removing debugging logs and test data for a clean production release.

## v0.10.0 - UI & Usability Improvements

- Added a new modal to explain the application's purpose, capabilities, and limitations.
- Added a tooltip to the "Pages to Scrape" input to warn users that higher numbers will increase processing time.
- Enhanced the loading message with a pulse animation for better visual feedback during searches.

## v0.9.0 - Advanced Scraping & Pagination

- Implemented a multi-page scraping (pagination) feature to scan more than just the first page of a website.
- Added a "Pages to Scrape" input to the frontend, allowing the user to control the depth of the online search.
- Refactored the backend scraper to support a dictionary of site-specific rules.
- Replaced the URL text input with a site selection dropdown in the UI for a more controlled and user-friendly experience.
- Fixed multiple scraping bugs related to nested HTML tags and character encoding.

## v0.8.0 - Online Web Scraping and Search

- Created a new Python script (`scraper.py`) using Requests and BeautifulSoup to extract thumbnail and page URLs from a given webpage.
- Added a new `/scrape_and_search` API endpoint to the Flask backend.
- Implemented on-the-fly AI searching: the new endpoint scrapes a URL, downloads its thumbnails, builds a temporary in-memory FAISS index, and searches it with a user-uploaded image.
- Updated the frontend UI to include a URL input field to enable the online search mode.
- Modified the frontend results display to handle and link to the scraped online content.

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
