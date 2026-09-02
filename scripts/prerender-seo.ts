import fs from "node:fs";
import path from "node:path";
import { products, euro, type Product } from "../client/src/lib/store-data.ts";

const root = process.cwd();
const output = path.join(root, "dist", "public");
// Le domaine choisi pour NORTICAM est la référence publique du storefront.
// VITE_SITE_URL reste disponible si l’adresse doit être modifiée ultérieurement.
const configuredOrigin = (process.env.VITE_SITE_URL || "https://norticam.com").trim().replace(/\/+$/, "");
const publicOrigin = configuredOrigin;
const siteName = "NORTICAM";

// Ces artefacts de prévisualisation ne sont pas nécessaires sur Hostinger.
fs.rmSync(path.join(output, "__manus__"), { recursive: true, force: true });
fs.rmSync(path.join(output, ".gitkeep"), { force: true });

type Page = {
  route: string;
  title: string;
  description: string;
  body: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  image?: string | null;
};

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
const canonicalPath = (route: string) => route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`;
const absoluteUrl = (route: string) => publicOrigin ? `${publicOrigin}${canonicalPath(route)}` : undefined;
const productRoute = (product: Product) => `/produits/${product.handle}`;

function productCard(product: Product) {
  const image = product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy" width="640" height="640">` : "";
  return `<article class="seo-card">${image}<p>${escapeHtml(product.badge)}</p><h2><a href="${productRoute(product)}">${escapeHtml(product.title)}</a></h2><p>${escapeHtml(product.description)}</p><strong>${escapeHtml(euro(product.price))}</strong></article>`;
}

function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image ? [product.image] : undefined,
    description: product.description,
    brand: { "@type": "Brand", name: product.vendor || siteName },
    sku: product.variants[0]?.numericId,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productRoute(product)) || product.shopifyUrl,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

const carDashcams = products.filter((product) => /voiture/i.test(product.productType));
const motorcycleDashcams = products.filter((product) => /moto/i.test(product.productType));
const parkingDashcams = products.filter((product) => /parking|a510|a810|m550|x800/i.test(`${product.title} ${product.productType}`));

function categoryPage(route: string, label: string, title: string, description: string, selection: Product[]): Page {
  const url = absoluteUrl(route);
  return {
    route,
    title,
    description,
    body: `<main class="seo-page"><p class="seo-kicker">${escapeHtml(label)}</p><h1>${escapeHtml(title.split(" | ")[0])}</h1><p class="seo-lead">${escapeHtml(description)}</p><nav aria-label="Catégories"><a href="/boutique">Toute la gamme</a><a href="/dashcam-voiture">Dashcams voiture</a><a href="/dashcam-moto">Dashcams moto</a><a href="/mode-parking">Mode parking</a></nav><section><h2>Modèles disponibles</h2><div class="seo-grid">${selection.map(productCard).join("")}</div></section></main>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: label,
      url,
      numberOfItems: selection.length,
      itemListElement: selection.map((product, position) => ({ "@type": "ListItem", position: position + 1, url: absoluteUrl(productRoute(product)) || product.shopifyUrl, name: product.title })),
    },
  };
}

const guides = [
  { slug: "quelle-dashcam-voiture-choisir", title: "Comment choisir une dashcam selon votre usage ?", description: "Les critères essentiels pour choisir une dashcam voiture selon vos trajets, votre véhicule et la couverture recherchée.", body: "Commencez par votre usage : trajets quotidiens, couverture recherchée et environnement de stationnement. Ensuite, consultez les variantes et les informations disponibles sur chaque fiche produit." },
  { slug: "dashcam-avant-arriere-guide", title: "Avant, arrière, 4K : que faut-il vraiment regarder ?", description: "Un guide pour comparer l’angle de couverture, les configurations avant et arrière et les informations utiles d’une dashcam.", body: "Une couverture plus large peut aider à documenter davantage de contexte. Comparez les produits disponibles, leurs variantes et les indications de montage avant de choisir." },
  { slug: "dashcam-moto-guide", title: "Préparer l’installation de votre dashcam moto", description: "Les points à vérifier avant de choisir et d’installer une dashcam moto : positionnement, alimentation et compatibilité.", body: "Vérifiez le positionnement, l’exposition et les informations de compatibilité indiquées pour chaque modèle moto avant de planifier l’installation." },
];

const pages: Page[] = [
  {
    route: "/",
    title: "Dashcam voiture et moto : comparer, choisir et acheter | NORTICAM",
    description: "Découvrez les dashcams voiture et moto NORTICAM : catalogue réel, comparatif, quiz de choix et guides d’installation.",
    body: `<main class="seo-page"><p class="seo-kicker">SÉCURITÉ AUTOMOBILE, SIMPLIFIÉE</p><h1>Chaque trajet mérite une preuve.</h1><p class="seo-lead">NORTICAM sélectionne des dashcams voiture et moto pour documenter les trajets et vous aider à choisir sans jargon.</p><p><a class="seo-button" href="/quiz">Trouver ma dashcam</a> <a class="seo-button seo-button--outline" href="/boutique">Découvrir la gamme</a></p><section><h2>La gamme NORTICAM</h2><div class="seo-grid">${products.slice(0, 6).map(productCard).join("")}</div></section><section><h2>Choisir selon votre usage</h2><ul><li><a href="/dashcam-voiture">Dashcams voiture</a></li><li><a href="/dashcam-moto">Dashcams moto</a></li><li><a href="/mode-parking">Dashcams pour le mode parking</a></li><li><a href="/comparatif">Comparer les modèles</a></li></ul></section></main>`,
    schema: { "@context": "https://schema.org", "@type": "Organization", name: siteName, url: publicOrigin || undefined, description: "Sélection de dashcams voiture et moto pour documenter les trajets." },
  },
  categoryPage("/boutique", "La sélection NORTICAM", "Boutique dashcam voiture et moto | NORTICAM", "Explorez le catalogue réel de dashcams voiture et moto, puis choisissez la configuration qui répond à votre usage.", products),
  categoryPage("/dashcam-voiture", "Dashcams voiture", "Dashcam voiture : modèles et prix | NORTICAM", "Découvrez les modèles voiture disponibles pour documenter vos trajets et comparer les options selon votre usage.", carDashcams),
  categoryPage("/dashcam-moto", "Dashcams moto", "Dashcam moto : modèles disponibles | NORTICAM", "Découvrez les dashcams moto disponibles et vérifiez les informations de montage, d’alimentation et de compatibilité.", motorcycleDashcams),
  categoryPage("/mode-parking", "Dashcams mode parking", "Dashcam mode parking : modèles disponibles | NORTICAM", "Explorez les modèles à comparer lorsque votre usage implique la surveillance du véhicule à l’arrêt.", parkingDashcams),
  {
    route: "/comparatif",
    title: "Comparatif dashcam voiture et moto : modèles et variantes | NORTICAM",
    description: "Comparez les modèles NORTICAM selon leur prix, leurs variantes et leur disponibilité avant de consulter les fiches produit complètes.",
    body: `<main class="seo-page"><p class="seo-kicker">COMPARATIF NORTICAM</p><h1>Comparer les modèles selon ce qui compte vraiment.</h1><p class="seo-lead">Comparez une première sélection de produits réels du catalogue, puis consultez leur fiche pour vérifier les options et compatibilités.</p><div class="seo-grid">${products.slice(0, 3).map(productCard).join("")}</div><p><a class="seo-button" href="/quiz">Trouver ma dashcam</a></p></main>`,
  },
  {
    route: "/quiz",
    title: "Quel dashcam choisir ? Quiz voiture et moto | NORTICAM",
    description: "Répondez à quelques questions pour trouver une catégorie de dashcam voiture ou moto adaptée à votre usage.",
    body: `<main class="seo-page"><p class="seo-kicker">LE QUIZ NORTICAM</p><h1>Quelques réponses. Un point de départ plus clair.</h1><p class="seo-lead">Le quiz NORTICAM vous oriente vers une catégorie de produits réellement disponible dans la boutique.</p><ol><li>Définissez votre véhicule et votre usage.</li><li>Identifiez la couverture recherchée.</li><li>Consultez les produits et variantes disponibles.</li></ol><p><a class="seo-button" href="/dashcam-voiture">Explorer les dashcams voiture</a> <a class="seo-button seo-button--outline" href="/dashcam-moto">Explorer les dashcams moto</a></p></main>`,
  },
  {
    route: "/conseils",
    title: "Conseils dashcam voiture et moto : choix et installation | NORTICAM",
    description: "Guides NORTICAM pour choisir une dashcam voiture ou moto, comprendre les critères utiles et préparer l’installation.",
    body: `<main class="seo-page"><p class="seo-kicker">CONSEILS NORTICAM</p><h1>Des explications utiles avant de choisir.</h1><p class="seo-lead">Des repères simples pour comprendre les configurations dashcam et préparer une installation cohérente.</p><section><h2>Guides NORTICAM</h2><ul>${guides.map((guide) => `<li><a href="/conseils/${guide.slug}">${escapeHtml(guide.title)}</a><p>${escapeHtml(guide.description)}</p></li>`).join("")}</ul></section></main>`,
    schema: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Conseils dashcam NORTICAM", hasPart: guides.map((guide) => ({ "@type": "Article", headline: guide.title, url: absoluteUrl(`/conseils/${guide.slug}`) })) },
  },
];

for (const guide of guides) {
  pages.push({
    route: `/conseils/${guide.slug}`,
    title: `${guide.title} | NORTICAM`,
    description: guide.description,
    body: `<main class="seo-page"><p class="seo-kicker">CONSEILS NORTICAM</p><article><h1>${escapeHtml(guide.title)}</h1><p class="seo-lead">${escapeHtml(guide.description)}</p><p>${escapeHtml(guide.body)}</p><p><a class="seo-button" href="/boutique">Voir les produits disponibles</a></p></article></main>`,
    schema: { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, mainEntityOfPage: absoluteUrl(`/conseils/${guide.slug}`) },
  });
}

for (const product of products) {
  pages.push({
    route: productRoute(product),
    title: `${product.title} : prix, variantes et disponibilité | NORTICAM`,
    description: `${product.title} : consultez le prix, les variantes disponibles et les informations essentielles avant achat chez NORTICAM.`,
    image: product.image,
    body: `<main class="seo-page"><p class="seo-kicker">${escapeHtml(product.vendor || siteName)}</p><article class="seo-product">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" width="900" height="900">` : ""}<div><h1>${escapeHtml(product.title)}</h1><p class="seo-lead">${escapeHtml(product.story)}</p><p class="seo-price">${escapeHtml(euro(product.price))}</p><p>${product.available ? "Disponible au moment de la synchronisation du catalogue." : "Indisponible au moment de la synchronisation du catalogue."}</p><h2>Informations essentielles</h2><ul>${product.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul><p><a class="seo-button" href="${escapeHtml(product.shopifyUrl)}">Voir et acheter sur Shopify</a></p></div></article></main>`,
    schema: productSchema(product),
  });
}

function inject(html: string, page: Page) {
  const canonical = absoluteUrl(page.route);
  const imageTags = page.image ? `<meta property="og:image" content="${escapeHtml(page.image)}"><meta name="twitter:image" content="${escapeHtml(page.image)}">` : "";
  const canonicalTag = canonical ? `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">` : "";
  const schema = page.schema ? `<script type="application/ld+json">${JSON.stringify(Array.isArray(page.schema) ? page.schema : [page.schema]).replace(/</g, "\\u003c")}</script>` : "";
  const meta = `<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">${canonicalTag}${imageTags}${schema}`;
  const fallback = `<div id="root" data-seo-static><style>.seo-page{max-width:1180px;margin:0 auto;padding:72px 24px;font-family:Arial,sans-serif;color:#09162d;background:#f7f8fb}.seo-page h1{font-size:clamp(2.25rem,5vw,4.5rem);line-height:1.02;max-width:920px;margin:12px 0 20px}.seo-page h2{margin-top:48px}.seo-lead{font-size:1.15rem;line-height:1.7;max-width:720px;color:#46546d}.seo-kicker{letter-spacing:.13em;font-size:.75rem;font-weight:700;color:#1672d8}.seo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:22px;margin-top:24px}.seo-card{background:#fff;border-radius:22px;padding:18px}.seo-card img{display:block;width:100%;aspect-ratio:1;object-fit:contain;background:#eef1f4;border-radius:16px}.seo-card h2{font-size:1.15rem;margin:13px 0}.seo-card p{font-size:.9rem;line-height:1.6;color:#576278}.seo-card a{color:inherit}.seo-button{display:inline-block;background:#1672d8;color:#fff!important;padding:13px 20px;border-radius:999px;text-decoration:none;font-weight:700;margin:20px 8px 0 0}.seo-button--outline{background:#0a1730}.seo-product{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:52px;align-items:start}.seo-product>img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:28px;background:#eef1f4}.seo-price{font-size:2rem;font-weight:800}@media(max-width:720px){.seo-page{padding:42px 18px}.seo-product{grid-template-columns:1fr}}</style>${page.body}</div>`;
  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>/, "").replace(/<meta name="description"[^>]*>/, "");
  return withoutTitle.replace("</head>", `${meta}</head>`).replace('<div id="root"></div>', fallback);
}

const source = path.join(output, "index.html");
if (!fs.existsSync(source)) throw new Error("Le build Vite est introuvable : lancez ce script après vite build.");
const shell = fs.readFileSync(source, "utf8");
for (const page of pages) {
  const destination = page.route === "/" ? source : path.join(output, page.route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, inject(shell, page));
}

const robotsPath = path.join(output, "robots.txt");
const robots = ["User-agent: *", "Allow: /", "Disallow: /cart", "Disallow: /checkout", ...(publicOrigin ? [`Sitemap: ${publicOrigin}/sitemap.xml`] : [])].join("\n") + "\n";
fs.writeFileSync(robotsPath, robots);

// Les routes publiques sont déjà générées comme dossiers avec index.html.
// On ne réécrit donc pas toutes les URL vers l’accueil : cela préserverait mal
// les 404 légitimes pour les produits ou articles inexistants.
const htaccess = `Options -MultiViews
DirectoryIndex index.html
RewriteEngine On

# Un seul hôte canonique : www.norticam.com -> norticam.com.
RewriteCond %{HTTP_HOST} ^www\\.norticam\\.com$ [NC]
RewriteRule ^ https://norticam.com%{REQUEST_URI} [R=301,L]

# En-têtes sûrs pour la version statique, sans bloquer les médias Shopify CDN.
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
</IfModule>
`;
fs.writeFileSync(path.join(output, ".htaccess"), htaccess);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${absoluteUrl(page.route)}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(output, "sitemap.xml"), sitemap);
console.log(`Pré-rendu SEO : ${pages.length} pages et sitemap générés pour ${publicOrigin}.`);
