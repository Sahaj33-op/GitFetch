# GitHub Profile Extractor

A modern, responsive web application that extracts and beautifully visualizes GitHub user profiles. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Profile Dashboard:** Get a comprehensive view of any GitHub user by simply entering their username.
- **Stats Summary:** Quick insights into total stars, forks, repository count, and top projects.
- **Top Languages:** Visual representation of the most used programming languages across repositories.
- **Recent Activity:** A timeline of recent GitHub events including pushes, pull requests, issues, and more.
- **Profile README:** beautifully rendered Markdown support for users' profile READMEs.
- **Repository List:** Browse, search, and sort public repositories with details like language, stars, forks, and project start dates.
- **Markdown Export:** Export the entire profile dashboard (including stats, languages, activity, and repositories) into a clean, well-formatted Markdown document.

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS V4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Markdown Rendering:** React Markdown with GFM and raw HTML support

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

1. Open the application in your browser.
2. Enter any GitHub username in the search bar.
3. Explore the loaded profile, including their stats, languages, recent activity, and repositories.
4. Click the "Export Markdown" button to download or copy the profile summarized in Markdown format.
