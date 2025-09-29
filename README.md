# AI Video Finder

This project is a full-stack application that uses an AI-powered backend to find the source video of a specific moment using only a screenshot.

## Current Status: Full-Stack Prototype

The project is a functional prototype consisting of two main parts: a Python/Flask backend and a Next.js/React frontend.

- **Backend (`/backend`):** A Flask server exposes a `/search` API that can process an uploaded image. It uses a pre-computed index (created by `main.py`) to find visually similar frames from a video library.
- **Frontend (`/frontend`):** A Next.js application provides a user interface for uploading a screenshot, sending it to the backend, and displaying the search results. The UI is designed with a Neo-Brutalist aesthetic.

## How to Run

This project requires two terminals running simultaneously.

### 1. Setup

First, install the required Python libraries:

```sh
pip install Flask opencv-python torch sentence-transformers faiss-cpu Pillow
```

### 2. Index Your Videos

Before starting, you must create the search index.

1. Place your video files (`.mp4`) into the `/backend/videos/` directory.
2. In your first terminal, navigate to the backend folder and run the indexing script:

```sh
cd backend
python main.py
```

This will generate the `video_index.faiss` file.

### 3. Run the Backend Server

In the same terminal (after indexing is complete), start the Flask server:

```sh
python app.py
```

The backend will now be running on `http://localhost:5000`.

### 4. Setup Run the Frontend Server

1. Open a second terminal, navigate to the frontend folder, and install dependencies:

```sh
cd frontend
npm install
```

2. Run the Next.js development server:

```sh
npm run dev
```

The frontend will now be running on `http://localhost:3000`. You can open this URL in your browser to use the application.

## Next Steps

The following features are planned for the next version:

- [ ] **Multi-Video Support:** Update the indexing script to process all videos in the `/videos` directory and include the source video name in the index.
- [ ] **Improved Results:** Display results grouped by the source video, showing a thumbnail for each potential video match.
- [ ] **Frame Previews:** For each result, show the top 3 matching frame images as clickable thumbnails.
