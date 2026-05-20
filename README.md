<div align="center">

# 🚀 GitHub Profile Extractor

<p align="center">
  <img src="https://img.shields.io/badge/React_19-%2320232A?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-%2338B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vite-%23B73BA5?style=for-the-badge&logo=vite&logoColor=%23FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Gemini_AI-%238E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini AI" />
</p>

### A premium, visually stunning web application to extract, visualize, analyze, and export GitHub developer profiles.

**[🚀 Live Demo](https://gitfetch-sahaj33.vercel.app/)** • **[💻 GitHub Repository](https://github.com/Sahaj33-op/GitFetch.git)**

[Explore Features](#sparkles-features) • [Technical Highlights](#building_construction-technical-highlights) • [Getting Started](#gear-getting-started) • [Usage](#rocket-usage)

<br />

#### 🎨 Premium Dark & Light Themes
<p align="center">
  <img src="./public/screenshot%20dark.png" alt="GitFetch Dark Theme" width="49%" />
  &nbsp;
  <img src="./public/screenshot%20light.png" alt="GitFetch Light Theme" width="49%" />
</p>

</div>

---

## ✨ Features

- **📊 Comprehensive Developer Dashboard:** Instantly visualizes any GitHub user's profile statistics, repository metrics, language ratios, and organizational affiliations.
- **🎨 Elite Glassmorphic Interface:** Exquisite translucent glass panels (`.glass-panel`) backed by hardware-accelerated filters, organic floating glow meshes, and smooth visual transitions.
- **🌗 Selector-Based Dark Mode:** Full manual light/dark theme toggler styled to perfection with customized scroll tracks and fully responsive layouts.
- **🔽 Collapsible Dashboard Sections:** Expand and collapse the **Primary Languages**, **Recent Activity Feed**, and **Profile README** modules dynamically using clean, micro-animated toggle selectors.
- **💬 Conversational AI Assistant:** A built-in chat widget to interview profiles, review their codebases, or query experience. Powered by a flexible backend proxy supporting **Google Gemini**, **OpenAI**, **Anthropic Claude**, **Groq**, **Mistral AI**, **OpenRouter**, and local **Ollama** models.
- **🔒 Autofill & Layering Safeguards:** Advanced input layering (`z-10` absolute stacking) and customized `-webkit-autofill` overrides to preserve clean glassmorphic input styling and icon visibility under all browser auto-fill states.
- **📑 One-Click Markdown Export:** Instantly compile the entire visual dashboard into a pristine, ready-to-share markdown document, perfect for developer resumes or portfolio attachments.

---

## 🛠️ Tech Stack

*   **Core:** React 19 SPA + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS V4 (utilizing modern `@import "tailwindcss"`, CSS variables, and selector-based variant compiling)
*   **Icons:** Lucide React
*   **Data Visualization:** Recharts (theme-responsive layouts with fully customized overlay tooltips)
*   **Markdown Rendering:** React Markdown (with full GFM integration and custom media wrappers)

---

## 🏗️ Technical Highlights

### 1. Tailwind v4 Custom Dark Mode Selector
In index.css, a custom variant is registered to enable root element class theme swapping:
```css
@variant dark (&:where(.dark, .dark *));
```
This bypasses standard system preference bindings, letting users toggle manually between dark and light themes smoothly.

### 2. Browser Autofill CSS Overrides
Default browser auto-fill styles can break translucent glass backgrounds. GitFetch incorporates custom webkit autofill rules to preserve premium glass styles:
```css
input:-webkit-autofill {
  -webkit-text-fill-color: #09090b !important;
  transition: background-color 5000s ease-in-out 0s;
  box-shadow: 0 0 0px 1000px #ffffff inset !important;
}
```

### 3. Stacking Context & Icon Layering
Absolute search and PAT icons utilize explicit `z-10` layers, remaining visible even when browsers overlay autofilled yellow backgrounds onto input elements.

---

## ⚙️ Getting Started

Get up and running locally in seconds.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sahaj33-op/GitFetch.git
   cd GitFetch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Your app will launch locally on `http://localhost:5173` (Frontend) and the server will execute on `http://localhost:3000` (API Proxy).*

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🚀 Usage

1. **Search**: Enter any GitHub username in the header search input.
2. **Access Token (Optional)**: Click the PAT icon to enter a fine-grained Read-Only Personal Access Token. This increases API limits and fetches SAML-protected organizations, private repositories, and comprehensive activity feeds.
3. **Conversational Assistant**: Click the floating bubble in the bottom right, enter your preferred API key (Gemini, Claude, OpenAI, etc.), and converse directly with the chatbot about the user's skillset, active repos, and coding timeline.
4. **Markdown Export**: Generate a beautifully compiled portfolio summary with a single click.

---

<div align="center">
  <i>Developed with passion for open-source developers. Let's make profiles beautiful.</i>
</div>
