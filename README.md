# AI Video Frame Finder

<p align="center">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/version-v1.1.0-blue.svg" alt="Version" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/status-active-brightgreen.svg" alt="Status" />
</p>

An AI-powered desktop application to find the source of a video clip by searching a website's thumbnails with a screenshot.

## About The Project

This application allows a user to take a screenshot from a video clip and find its original source on a supported website. It works by scraping the thumbnail images from the site's video pages and using a powerful AI model (CLIP) to find the closest visual match to the user's uploaded image.

This project is a full-stack desktop application built with a React/Next.js frontend and a Python/Flask backend, all wrapped in an Electron shell.

### ✨ Features

- **Intuitive Interface:** A clean, single-page application with a unique Neo-Brutalist design.
- **Dark & Light Modes:** A persistent theme toggle with custom icons.
- **AI-Powered Search:** Uses a powerful AI model to find visual matches between a screenshot and website thumbnails.
- **Multi-Page Scraping:** Can scrape multiple pages of a supported website in a single search.
- **Customizable Searches:** Select from a list of supported sites and define how many pages and results to show.
- **Dynamic Feedback:** Provides a live progress indicator, a startup loader for the AI model, and a performance tooltip.
- **Clear Documentation:** An in-app "About This App" modal clarifies the tool's capabilities.

### ☕ Support This Project

If you find this application useful, please consider supporting its development!

<a href="https://www.google.com/search?q=https://www.buymeacoffee.com/PupRiku" target="_blank"><img src="https://www.google.com/search?q=https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

### Built With

- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Python, Flask, PyTorch
- **AI:** SentenceTransformers (CLIP), Faiss
- **Desktop Shell:** Electron, Electron Builder
- **Scraping:** Requests, BeautifulSoup

## Getting Started (For Users)

1.  Go to the **Releases** section on the right-hand side of this GitHub page.
2.  Download the latest installer file (e.g., `VidFinder-Setup-1.1.0.exe`).
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

## Credits and Attribution

The application icon was created using assets from Flaticon.

- <a href="https://www.flaticon.com/free-icons/film" title="film icons">Film icons created by Freepik - Flaticon</a>
- <a href="https://www.flaticon.com/free-icons/magnifying-glass" title="magnifying glass icons">Magnifying glass icons created by Muhammad_Usman - Flaticon</a>
