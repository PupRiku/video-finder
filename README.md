# AI Video Frame Finder

An AI-powered desktop application to find the source of a video clip by searching a website's thumbnails with a screenshot.

## Current Status: v1.0.3

This is a stable release that packages a Python/Flask backend and a Next.js/React frontend into a single desktop application using Electron. It includes key bug fixes for stability and performance.

### ✨ Features

- **Intuitive Interface:** A clean, single-page application designed for ease of use.
- **Dynamic Feedback:** A live, animated progress indicator during searches and a performance tooltip to warn about intensive tasks.
- **Clear Documentation:** An in-app "About This App" modal clarifies the tool's capabilities and limitations.
- **Customizable Searches:** Select from a pre-configured list of supported sites and define the number of pages to scrape for each search.

## Getting Started (For Users)

1.  Go to the **Releases** section on the right-hand side of this GitHub page.
2.  Download the latest installer file (e.g., `VidFinder-Setup-1.0.3.exe`).
3.  Run the installer and launch the application from the desktop shortcut or Start Menu.

## For Developers

To run this project in a development environment, you will need two terminals.

### 1. Backend Setup & Run

1.  Navigate to the `/backend` folder.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Package the backend into an executable by running: `pyinstaller --onefile app.py`.
    - This creates the `app.exe` file in `/backend/dist/` that the Electron app needs.

### 2. Frontend Setup & Run

1.  Navigate to the `/frontend` folder in a new terminal.
2.  Install dependencies: `npm install`.
3.  Run the development server and Electron app concurrently:
    ```sh
    npm run electron:dev
    ```
