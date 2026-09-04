import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Le pré-rendu génère une page statique par route publique : express.static
  // les sient déjà. Le fallback SPA ne doit couvrir QUE les routes client
  // non pré-rendues — sinon toute URL inconnue renverrait un 200 (soft 404),
  // ce qui diluerait la qualité perçue du site par les moteurs.
  const spaFallbackRoutes = ["/cart", "/checkout"];
  app.get(spaFallbackRoutes, (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Tout le reste : vraie 404. On sert la page 404 statique du pré-rendu
  // quand elle existe, avec le bon code de statut.
  const notFoundPage = path.join(staticPath, "404.html");
  app.use((_req, res) => {
    if (fs.existsSync(notFoundPage)) {
      res.status(404).sendFile(notFoundPage);
    } else {
      res.status(404).send("Page introuvable");
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
