# 📖 GitFetch Documentation

Welcome to the official developer documentation for **GitFetch** (GitHub Profile Extractor). This document outlines the technical architecture, design system, core features, and setup guidelines for developers looking to extend or self-host the application.

- **GitHub Repository**: [https://github.com/Sahaj33-op/GitFetch.git](https://github.com/Sahaj33-op/GitFetch.git)
- **Live Deployment**: [https://gitfetch-sahaj33.vercel.app/](https://gitfetch-sahaj33.vercel.app/)

---

## 🎨 Visual Showcase

GitFetch features a high-fidelity glassmorphism design that flows dynamically with the chosen theme.

### Premium Dark Theme
An immersive deep-indigo backdrop with vibrant floating glow meshes and frosted dark panels.
![GitFetch Dark Mode](../public/screenshot%20dark.png)

### Premium Light Theme
A beautiful cool white-to-lavender gradient with elevated opaque white glass panels and vivid colored glows.
![GitFetch Light Mode](../public/screenshot%20light.png)

---

## 🏗️ Technical Architecture & Core Foundations

GitFetch is constructed as a modern single-page application (SPA) with high performance and visual premium design as core objectives.

### 1. Advanced Tailwind CSS V4 Design System
The visual system is engineered using Tailwind CSS v4. A few key highlights:
- **Selector-Based Theme Toggle**: Implemented manually-controlled dark mode by registering a custom Tailwind variant to respond to root element classes:
  ```css
  @variant dark (&:where(.dark, .dark *));
  ```
- **Custom Display Fonts**: Overrode the default sans-serif font family in index.css with `Outfit` (for display/headers) and `Inter` (for metadata/body texts) to establish a premium typographic rhythm.
- **Translucent Glassmorphism Panels**: Developed the `.glass-panel` custom class to leverage hardware-accelerated `backdrop-filter: blur(20px)` and reflective inset-borders.

### 2. Collapsible Dynamic Sections
To enhance dashboard readability, the key data components are collapsible (drop-down able) with smooth CSS transitions:
- **Primary Languages**: Displays interactive language distribution charts and responsive legends.
- **Activity Feed**: Presents a chronological timeline of recent user contributions.
- **Profile README**: Renders the custom GitHub profile markdown or its raw code container.

### 3. Comprehensive Metric Summaries
Presents clean and elevated metric counters for stars, forks, repository counts, and key stats using custom Lucide icon gradient backings.

---

## 📁 Codebase Structure

```bash
GitFetch/
├── api/                  # Vercel serverless functions for rate limit management
├── public/               # Static assets & screenshots
│   ├── screenshot light.png
│   └── screenshot dark.png
├── src/
│   ├── components/       # Dashboard & UI component architecture
│   │   ├── TopLanguages.tsx   # Collapsible Lang chart
│   │   ├── RecentActivity.tsx # Collapsible event timeline
│   │   ├── ProfileReadme.tsx  # Collapsible profile markdown
│   │   ├── GitHubProfile.tsx  # User info component
│   │   └── LandingContent.tsx # Visual showcase landing page
│   ├── lib/              # API and parsing utility libraries
│   ├── App.tsx           # Global coordinator & theme provider
│   ├── index.css         # Styling system & core custom utilities
│   └── main.tsx          # Application bootstrapper
├── README.md             # Primary README introducing the app
└── package.json          # Dependency manifest
```

---

## ⚙️ Build & Development Guidelines

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server**:
   ```bash
   npm run dev
   ```

3. **Production Compilation**:
   ```bash
   npm run build
   ```

---

<div align="center">
  <sub>Developed with passion for open-source developers. Code hosted at <a href="https://github.com/Sahaj33-op/GitFetch.git">github.com/Sahaj33-op/GitFetch</a></sub>
</div>
