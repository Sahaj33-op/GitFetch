<div align="center">

# ⚡ GitFetch

### Turn any GitHub profile into a beautiful dashboard, Markdown export, and AI-ready portfolio context.

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/AI_Assistant-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="AI Assistant" />
</p>

<p align="center">
  <b>Explore developer profiles. Analyze repositories. Export structured context for portfolios, resumes, and AI website builders.</b>
</p>

<p align="center">
  <a href="https://gitfetch-sahaj33.vercel.app/"><b>🚀 Live Demo</b></a>
</p>

<p align="center">
  <a href="#-why-gitfetch">Why GitFetch</a>
  ·
  <a href="#-features">Features</a>
  ·
  <a href="#-ai-ready-portfolio-export">AI Export</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
  ·
  <a href="#-getting-started">Getting Started</a>
</p>

<br />

<p align="center">
  <img src="./public/screenshot%20dark.png" alt="GitFetch dark theme dashboard" width="49%" />
  &nbsp;
  <img src="./public/screenshot%20light.png" alt="GitFetch light theme dashboard" width="49%" />
</p>

</div>

---

## ✨ Why GitFetch?

GitHub profiles contain useful developer signal, but turning that data into a portfolio, resume section, LinkedIn summary, or project case study is still painfully manual. Because apparently we built global developer infrastructure and still copy-paste project descriptions like medieval scribes.

**GitFetch solves that workflow:**

```txt
GitHub username → visual profile dashboard → structured Markdown → AI-ready portfolio context
```

Use it to quickly understand a developer profile, identify strong projects, export profile data, and provide clean context to tools like **ChatGPT**, **Claude**, **Cursor**, **v0**, **Bolt**, or **Lovable** for portfolio generation.

---

## 🚀 Features

### Profile Intelligence

- **Developer dashboard** with profile summary, follower counts, repository metrics, and public activity.
- **Repository explorer** with searchable, sortable project cards.
- **Primary language breakdown** based on repository primary languages.
- **Recent activity feed** for pushes, pull requests, issues, stars, and repository creation events.
- **Organization display** for public or token-authorized organization memberships.
- **Profile README rendering** with GitHub-flavored Markdown support.

### Export Workflows

- **Markdown profile export** for resumes, notes, documentation, or portfolio planning.
- **AI portfolio context export** designed for AI tools and website builders.
- **Copy-to-clipboard workflow** for fast handoff into ChatGPT, Claude, Cursor, v0, Bolt, Lovable, and similar tools.

### AI Assistant

- Built-in profile assistant for asking questions about the loaded GitHub profile.
- Supports multiple providers through the backend proxy:
  - Google Gemini
  - OpenAI
  - Anthropic Claude
  - Groq
  - Mistral AI
  - OpenRouter
  - Ollama for local models

### Interface

- Responsive glassmorphism-inspired UI.
- Manual light/dark theme support.
- Collapsible dashboard sections.
- Polished input states, autofill handling, and layered icon styling.
- Clean dashboard layout optimized for screenshots, sharing, and quick profile review.

---

## 🧠 AI-Ready Portfolio Export

GitFetch can export a structured Markdown summary that AI tools can use to generate professional portfolio material.

Example use-cases:

- Generate a full developer portfolio website.
- Create resume-ready project bullet points.
- Write LinkedIn featured project descriptions.
- Build GitHub profile README content.
- Create project case studies from repository metadata.
- Summarize a developer profile for recruiters or collaborators.

Example prompt after copying GitFetch AI context:

```txt
Use this GitHub profile context to create a modern developer portfolio website.
Include a homepage hero, about section, skills section, project cards, SEO metadata, and resume-style project bullets.
Do not exaggerate impact. Use only the evidence available in the exported context.
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, custom CSS variables, selector-based dark mode |
| Charts | Recharts |
| Icons | Lucide React |
| Markdown | React Markdown, Remark GFM |
| Backend | Express API proxy |
| AI Providers | Gemini, OpenAI, Anthropic, Groq, Mistral, OpenRouter, Ollama |
| Deployment | Vercel-ready frontend/server setup |

---

## 🏗️ Technical Highlights

### Selector-Based Dark Mode

GitFetch uses a Tailwind v4 custom dark variant for manual theme control:

```css
@variant dark (&:where(.dark, .dark *));
```

This keeps theme switching predictable and independent from system preference when the user manually chooses a theme.

### GitHub API Data Layer

The GitHub data layer fetches profile data, repositories, organizations, social links, profile README content, and recent public activity. Repository fetching is capped to avoid excessive rate-limit pressure, with warnings shown when results may be incomplete.

### Markdown Export Pipeline

Profile data is converted into clean Markdown for two different workflows:

1. **General profile export** for sharing and documentation.
2. **AI portfolio context export** for portfolio builders, resume generation, and project summaries.

### AI Provider Proxy

The Express backend proxies chat requests to supported AI providers so the frontend can keep the profile assistant provider-agnostic.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sizwinz/GitFetch.git
cd GitFetch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file if you want a default Gemini key for the AI assistant:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Users can also provide their own AI provider keys inside the app settings.

### 4. Run locally

```bash
npm run dev
```

The app runs through the Express + Vite development server:

```txt
http://localhost:3000
```

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🚦 Usage

1. **Search a profile**  
   Enter any GitHub username and load their public profile data.

2. **Optionally use a GitHub token**  
   Add a fine-grained, read-only GitHub Personal Access Token to increase rate limits or access token-authorized data.

3. **Review the dashboard**  
   Explore profile stats, repositories, languages, activity, organizations, and README content.

4. **Export Markdown**  
   Generate a clean Markdown report of the profile.

5. **Copy AI portfolio context**  
   Paste the exported context into ChatGPT, Claude, Cursor, v0, Bolt, Lovable, or another AI tool to generate portfolio content.

6. **Ask the profile assistant**  
   Use the optional chat widget to ask questions about the loaded profile metadata.

---

## 🔐 Privacy & Token Notes

- GitHub tokens are optional.
- Use fine-grained, read-only tokens whenever possible.
- Do not enter broad-scope or long-lived tokens unless you understand the risk.
- If a token grants access to private repository metadata, review exported content before pasting it into any AI tool.
- AI assistant requests may be sent to the selected AI provider depending on your configuration.

---

## 📌 Roadmap Ideas

- GitHub OAuth flow instead of manual PAT input.
- Byte-level language statistics using repository language endpoints.
- More AI export templates for portfolios, resumes, LinkedIn, and GitHub READMEs.
- Project quality scoring based on metadata completeness, activity, stars, topics, and demos.
- JSON export for developer tools and automation pipelines.
- Better accessibility and keyboard navigation.

---

## 🤝 Contributing

Contributions, issues, and feature ideas are welcome.

Useful areas to improve:

- GitHub API rate-limit handling
- export templates
- accessibility
- AI context quality
- OAuth integration
- test coverage
- UI polish

---

<div align="center">

**GitFetch helps make GitHub profiles reusable, not just viewable.**

Built for developers, students, open-source builders, and anyone tired of manually explaining their repos to yet another text box.

</div>
