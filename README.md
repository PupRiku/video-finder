# AI Video Finder

This project is a full-stack application that uses an AI-powered backend to find the source video of a specific moment using only a screenshot.

## Current Status: Full-Stack Prototype (v0.8.0)

The project is a functional prototype with two main search modes: local file search and online web scraping.

- **Online Search:** The application can scrape a user-provided URL for thumbnail images, build an in-memory AI index, and search it in real-time to find the best visual match.
- **Local Search:** The backend can process a local library of multiple videos, creating a persistent, unified search index.
- **Accurate AI Matching:** The search logic uses a normalized inner product (IP) index with the CLIP model, providing accurate similarity scores.
- **Interactive Frontend:** A Next.js application provides a UI for uploading a screenshot and displaying results with thumbnails and color-coded match confidence scores.

## How to Run

This project requires two terminals running simultaneously.

### 1. Backend Setup & Indexing

### 1. Backend Setup & Run

1.  Navigate to the `/backend` folder.
2.  Install dependencies: `pip install -r requirements.txt` (or install them individually).
3.  To use local search, place videos in `/backend/videos/` and run `python main.py` to index them.
4.  Start the server: `python app.py`. The backend will run on `http://localhost:5000`.

### 2. Frontend Setup & Run

1.  Navigate to the `/frontend` folder in a new terminal.
2.  Install dependencies: `npm install`.
3.  Run the development server: `npm run dev`. The frontend will run on `http://localhost:3000`.
