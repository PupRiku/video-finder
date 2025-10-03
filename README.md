# AI Video Finder

This project is a full-stack application that uses an AI-powered backend to find the source video of a specific moment using only a screenshot.

## Current Status: Full-Stack Prototype (v0.9.0)

The project is a functional prototype with two main search modes: local file search and online web scraping.

- **Multi-Page Web Scraping:** The application can scrape multiple pages of a supported website, collecting all thumbnails in a single search. The number of pages to scrape is configurable in the UI.
- **Site-Specific Rules:** The backend is architected to support different scraping rules for different websites, which can be selected via a dropdown in the UI.
- **Accurate AI Matching:** The search logic uses a normalized inner product (IP) search index with the CLIP model, providing accurate similarity scores.
- **Interactive Frontend:** A Next.js application provides a UI for uploading a screenshot and displaying results with thumbnails and color-coded match confidence scores.

## How to Run

This project requires two terminals running simultaneously.

### 1. Backend Setup & Run

1.  Navigate to the `/backend` folder.
2.  Install dependencies: `pip install -r requirements.txt` (or install them individually).
3.  To use local search, place videos in `/backend/videos/` and run `python main.py` to index them.
4.  Start the server: `python app.py`. The backend will run on `http://localhost:5000`.

### 2. Frontend Setup & Run

1.  Open a **second terminal**, navigate to the `/frontend` folder, and install dependencies:
    ```sh
    cd frontend
    npm install
    ```
2.  Run the development server:
    ```sh
    npm run dev
    ```
    The frontend will now be running on `http://localhost:3000`.
