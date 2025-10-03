# AI Video Finder

This project is a full-stack application that uses an AI-powered backend to find the source video of a specific moment using only a screenshot.

## Current Status: Full-Stack Prototype (v0.10.0)

The project is a functional prototype with two main search modes: local file search and online web scraping. It includes a Python/Flask backend and a Next.js/React frontend with key usability features like a performance tooltip and an in-app guide.

## ✨ Features

- **Intuitive Interface:** A clean, single-page application designed for ease of use.
- **Dynamic Feedback:** A live, animated progress indicator during searches and a performance tooltip to warn about intensive tasks.
- **Clear Documentation:** An in-app "About This App" modal clarifies the tool's capabilities and limitations.
- **Customizable Searches:** Select from a pre-configured list of supported sites and define the number of pages to scrape for each search.

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
2.  Run the Next.js development server:
    ```sh
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`.
