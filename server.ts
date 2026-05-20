import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processChatRequest } from "./src/lib/chatService";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

app.post("/api/chat", async (req, res) => {
  try {
    const responseText = await processChatRequest(req.body);
    res.json({ text: responseText });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "An error occurred" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
