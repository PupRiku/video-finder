# AI Video Finder

This project is a full-stack application that uses an AI-powered backend to find the source video of a specific moment using only a screenshot.

## Current Status: Full-Stack Prototype (v0.6.0)

The project is a functional prototype consisting of a Python/Flask backend and a Next.js/React frontend.

- **Multi-Video Support:** The backend can process a library of multiple videos, creating a unified search index.
- **AI Search API:** A Flask server exposes a `/search` API that accepts an uploaded image, performs a similarity search, and returns a detailed list of matched frames.
- **Interactive Frontend:** A Next.js application provides a UI for uploading a screenshot.
- **Advanced Results Display:** The results are grouped by the source video, and thumbnails of the matched frames are displayed. Each match includes a color-coded percentage score indicating the confidence of the match.

## How to Run

This project requires two terminals running simultaneously.

### 1. Backend Setup & Indexing

1.  Place your video files (`.mp4`, `.avi`, etc.) into the `/backend/videos/` directory.
2.  In your first terminal, navigate to the backend folder and install dependencies:
    ```sh
    cd backend
    pip install Flask flask-cors opencv-python torch sentence-transformers faiss-cpu Pillow numpy
    ```
3.  Run the indexing script. This only needs to be done once, or when you add new videos.
    ```sh
    python main.py
    ```
4.  Once indexing is complete, start the backend server:
    ```sh
    python app.py
    ```
    The backend will now be running on `http://localhost:5000`.

### 2. Frontend Setup & Run

1.  Open a **second terminal**, navigate to the frontend folder, and install dependencies:
    ```sh
    cd frontend
    npm install
    ```
2.  Run the Next.js development server:
    ```sh
    npm run dev
    ```
    The frontend will now be running on `http://localhost:3000`. You can open this URL in your browser to use the application.
