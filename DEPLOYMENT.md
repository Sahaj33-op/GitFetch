# Deployment & Security Notes

## Environment Variables

When deploying the GitHub Profile Extractor, you need to configure the following environment variables:

| Variable | Description |
| -------- | ----------- |
| `GEMINI_API_KEY` | Optional. Required for the Google Gemini integration to work securely. Put your Gemini API Key here to enable the Profile Assistant AI feature server-side. |
| `NODE_ENV` | Typically set to `production` in deployed environments. |

## Application Architecture

The application is configured as a full-stack Node.js app using Express. 

* **Frontend:** Built with React 19 + Vite + Tailwind 4.
* **Backend:** Express JSON proxy and static file server. It handles the AI completions securely on the server-side to avoid exposing platform API keys (like Gemini).

## Vercel Deployment

For Vercel deployment, the application is pre-configured with a `vercel.json` and a serverless function entry-point at `api/chat.ts`.
This ensures that the deployed version on Vercel acts effectively identical to the Express local development server. 

**Vercel Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

## Security & API Keys

### Personal Access Tokens (PATs)
- Users can input their GitHub Personal Access Tokens (PAT) directly on the website to access private repos, SSO/SAML protected organizations, and bypass the standard rate-limit limits (60/hr unauthenticated vs 5,000/hr authenticated).
- **The user's PAT is NOT stored on the server.** It is stored strictly in their local browser session and passed securely via the request headers directly to GitHub APIs.
- Security warnings have been placed on the frontend to explicitly recommend against using the service on public/shared devices and against sharing tracking URLs if the PAT gets maliciously appended.

### AI Provider Keys
- To offer maximum flexibility, the site gives the user the capability to bring their own AI provider keys (OpenAI, Anthropic, Mistral, Groq, OpenRouter) or local endpoints (Ollama).
- **Custom AI Platform Keys are NOT logged or stored on our infrastructure.** They are processed entirely locally and submitted directly inside the user's payloads to the backend API which securely proxies them over HTTPS.
- In `server.ts` / `chatService.ts`, the Express proxy implements a hard limit on JSON request body payloads (`2mb`) which significantly reduces the potential for malicious memory allocations or DDoS vectors.
