import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import backendApp from "./backend/src/app";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = "0.0.0.0";

async function start() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const vite = await createViteServer({
      root: path.resolve(__dirname, "frontend"),
      server: {
        middlewareMode: true,
        hmr: false,
        host: HOST,
        port: PORT,
      },
      appType: "spa",
    });

    backendApp.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "frontend/dist");
    backendApp.use(express.static(distPath));
    backendApp.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  backendApp.listen(PORT, HOST, () => {
    console.log(`[Go Deliver] Server running on http://${HOST}:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
