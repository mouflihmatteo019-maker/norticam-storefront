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
  const staticPath = path.resolve(process.cwd(), "dist/public");

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    // Consolidate static HTML aliases before React routing: /index.html previously
    // served the homepage with HTTP 200 but rendered a not-found page in React.
    if (['GET', 'HEAD'].includes(req.method)) {
      const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
      const normalized = req.path.replace(/\/{2,}/g, '/').replace(/\/index\.html$/i, '/');
      const candidate = normalized.endsWith('/') ? normalized : normalized + '/';
      const target = path.resolve(staticPath, '.' + candidate, 'index.html');
      const isPage = target.startsWith(staticPath + path.sep) && fs.existsSync(target);
      const destination = isPage ? candidate : req.path;
      if (req.hostname.toLowerCase() === 'www.norticam.com') return res.redirect(301, 'https://norticam.com' + destination + query);
      if (isPage && destination !== req.path) return res.redirect(301, destination + query);
    }
    if (req.path.replace(/\/+$/, '') === '/conseils/meilleure-dashcam-voiture') return res.redirect(301, '/meilleure-dashcam/' + (req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : ''));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Do not include subdomains: checkout has its own hosting configuration.
    if (req.hostname === 'norticam.com') res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
  app.use((req, res, next) => {
    if (!['GET','HEAD'].includes(req.method)) return next();
    let pathname: string; try { pathname = decodeURIComponent(req.path); } catch { return next(); }
    const file = path.resolve(staticPath, '.' + pathname, ...(pathname.endsWith('/') ? ['index.html'] : []));
    if (!file.startsWith(staticPath + path.sep) || !/\.(html|js|css|svg|xml|json|txt)$/.test(file)) return next();
    const encoding = req.acceptsEncodings('br', 'gzip');
    const compressed = file + (encoding === 'br' ? '.br' : '.gz');
    res.vary('Accept-Encoding');
    if (!encoding || !fs.existsSync(compressed)) return next();
    res.setHeader('Content-Encoding', encoding);
    res.setHeader('Cache-Control', file.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
    res.type(path.extname(file));
    res.sendFile(compressed);
  });
  app.use(express.static(staticPath, { setHeaders(res, file) {
    res.setHeader('Cache-Control', file.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
  } }));

  // Le pré-rendu génère une page statique par route publique : express.static
  // les sient déjà. Le fallback SPA ne doit couvrir QUE les routes client
  // non pré-rendues — sinon toute URL inconnue renverrait un 200 (soft 404),
  // ce qui diluerait la qualité perçue du site par les moteurs.


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
