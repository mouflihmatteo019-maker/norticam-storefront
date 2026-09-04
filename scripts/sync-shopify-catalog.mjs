#!/usr/bin/env node
/**
 * Synchronisation du catalogue Shopify vers client/src/lib/store-data.ts
 *
 * Usage :
 *   node scripts/sync-shopify-catalog.mjs <export> <store-data.ts> [overrides.json]
 *
 * - export           : export Shopify au format JSON (result.data.products.nodes,
 *                      structure GraphQL de l'ancien pipeline) OU CSV natif Shopify
 *                      (Produits > Exporter, avec les variantes en lignes).
 * - store-data.ts    : fichier de sortie (client/src/lib/store-data.ts)
 * - overrides.json   : optionnel. Contenu éditorial unique par handle, qui
 *                      SURCHARGE les textes extraits/générés :
 *                      { "dashcam-3k-voiture": { "description": "...", "story": "...", "details": ["..."] } }
 *
 * Ce qui est pris dans Shopify :
 *   - titre, type, vendeur, tags, images, variantes (prix/disponibilité)
 *   - SEO Description (champ meta description rédigé dans Shopify)
 *   - Body (HTML) → premier paragraphe comme description de secours
 *     (TOUJOURS moins bien que les surcharges éditoriales : à rédiger !)
 *
 * Ne jamais committer de secret ici. Pour un export API direct, utiliser
 * SHOPIFY_STOREFRONT_TOKEN dans l'environnement (jamais dans le repo).
 */
import fs from "node:fs";
import path from "node:path";

const [, , sourceArg, targetArg, overridesArg] = process.argv;

if (!sourceArg || !targetArg) {
  console.error("Usage: node scripts/sync-shopify-catalog.mjs <export.json|export.csv> <store-data.ts> [overrides.json]");
  process.exit(1);
}

const source = path.resolve(sourceArg);
const target = path.resolve(targetArg);

if (!fs.existsSync(source)) {
  console.error(`Export introuvable : ${source}`);
  process.exit(1);
}

// Surcharges éditoriales : le seul endroit où vit le texte marketing unique.
const overrides = overridesArg && fs.existsSync(path.resolve(overridesArg))
  ? JSON.parse(fs.readFileSync(path.resolve(overridesArg), "utf8"))
  : {};

/* ---------------------------------- CSV ---------------------------------- */

/** Parseur CSV minimal compatible l'export Shopify (guillemets, virgules, sauts de ligne). */
function parseCsv(text) {
  const rows = [];
  let field = "", row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((cell) => cell !== "")) rows.push(row);
  const [header, ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""])));
}

const stripHtml = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const truncate = (text, max) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text);

function productsFromCsv(records) {
  const grouped = new Map();
  for (const record of records) {
    const handle = record.Handle;
    if (!handle) continue;
    if (!grouped.has(handle)) grouped.set(handle, { handle, variants: [], images: new Map() });
    const entry = grouped.get(handle);
    if (record.Title) entry.title = record.Title;
    if (record.Vendor) entry.vendor = record.Vendor;
    if (record.Type) entry.productType = record.Type;
    if (record.Tags) entry.tags = record.Tags;
    if (record["Published"]) entry.published = record["Published"].toLowerCase() === "true";
    if (record["SEO Description"]) entry.seoDescription = record["SEO Description"];
    if (record["Body (HTML)"]) entry.bodyHtml = record["Body (HTML)"];
    if (record["Variant Price"]) {
      const price = Number(record["Variant Price"]);
      if (!Number.isNaN(price)) {
        entry.variants.push({
          title: record["Option1 Value"] || record.Title || "Default Title",
          availableForSale: (record.Status || "active") === "active",
          price,
          options: [record["Option1 Name"], record["Option2 Name"], record["Option3 Name"]]
            .map((name, index) => name ? { name, value: [record["Option1 Value"], record["Option2 Value"], record["Option3 Value"]][index] } : null)
            .filter(Boolean),
        });
      }
    }
    if (record["Image Src"]) {
      const position = Number(record["Image Position"] || 0);
      if (!entry.images.has(position)) entry.images.set(position, { src: record["Image Src"], alt: record["Image Alt Text"] || "" });
    }
  }
  return [...grouped.values()].map((entry) => {
    const images = [...entry.images.entries()].sort((a, b) => a[0] - b[0]).map(([, image]) => image);
    return {
      id: `csv-${entry.handle}`,
      handle: entry.handle,
      title: entry.title || entry.handle,
      vendor: entry.vendor || "",
      productType: entry.productType || "Dashcam",
      published: entry.published !== false,
      seoDescription: entry.seoDescription || null,
      bodyText: entry.bodyHtml ? stripHtml(entry.bodyHtml) : "",
      featuredImage: images[0]?.src ? { url: images[0].src, altText: images[0].alt || entry.title || "" } : null,
      variants: {
        nodes: entry.variants.map((variant, index) => ({
          id: `csv-${entry.handle}-${index}`,
          title: variant.title,
          availableForSale: variant.availableForSale,
          price: String(variant.price),
          selectedOptions: variant.options,
          image: null,
        })),
      },
    };
  });
}

/* --------------------------------- JSON ---------------------------------- */

function productsFromJson(payload) {
  const nodes = payload?.result?.data?.products?.nodes ?? payload?.data?.products?.nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) {
    console.error("Structure JSON inattendue : products.nodes attendu (result.data.products.nodes).");
    process.exit(1);
  }
  return nodes;
}

/* ------------------------------- Communs --------------------------------- */

function shortTitle(title) {
  const chunks = title.split(/\s+[—–-]\s+/);
  return chunks.length > 1 ? chunks[chunks.length - 1].trim() : title.replace(/^Dashcam\s+/i, "");
}

function badge(product) {
  if (/moto/i.test(product.productType)) return /carplay|écran|ecran/i.test(product.title) ? "Écran moto connecté" : "Dashcam moto";
  if (/rétroviseur|retroviseur/i.test(product.title)) return "Rétroviseur dashcam";
  if (/4k|4K/i.test(product.title)) return "Dashcam 4K";
  if (/avant arrière|avant-arriere/i.test(product.title)) return "Avant & arrière";
  if (/3k/i.test(product.title)) return "Dashcam 3K";
  if (/2k|mini|discrète|discrete|compacte/i.test(product.title)) return "Dashcam compacte";
  return "Dashcam voiture";
}

const isCsv = source.toLowerCase().endsWith(".csv");
const raw = fs.readFileSync(source, "utf8");
const nodes = isCsv ? productsFromCsv(parseCsv(raw)) : productsFromJson(JSON.parse(raw));

// Les produits non publiés (brouillon Shopify) ne doivent pas atterrir sur le site.
const activeNodes = nodes.filter((product) => product.published !== false);
const skipped = nodes.filter((product) => product.published === false);
for (const product of skipped) console.warn(`[sync] Produit non publié, ignoré : ${product.handle}`);

const products = activeNodes.map((product) => {
  const variants = product.variants.nodes.map((variant) => ({
    id: variant.id,
    numericId: variant.id.split("/").pop(),
    title: variant.title,
    availableForSale: variant.availableForSale,
    // inventoryQuantity volontairement ABSENT du client : le stock exact ne doit
    // pas être lisible dans le bundle JS public. Disponibilité = booléen.
    price: Number(variant.price),
    options: variant.selectedOptions,
    image: variant.image?.url ?? null,
  }));
  const purchasable = variants.filter((variant) => variant.availableForSale);
  const price = variants.length ? Math.min(...variants.map((variant) => variant.price)) : 0;
  const editorial = overrides[product.handle] || {};
  const bodyFallback = product.bodyText ? truncate(product.bodyText, 220) : "";
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    shortTitle: shortTitle(product.title),
    vendor: product.vendor,
    productType: product.productType,
    type: product.productType.toLowerCase().includes("accessoire") ? "Accessoire" : "Dashcam",
    price,
    available: purchasable.length > 0,
    image: product.featuredImage?.url ?? null,
    imageAlt: product.featuredImage?.altText ?? product.title,
    badge: editorial.badge || badge(product),
    description: editorial.description || bodyFallback || `${product.productType} sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.`,
    story: editorial.story || "",
    details: Array.isArray(editorial.details) && editorial.details.length > 0
      ? editorial.details
      : ["Produit du catalogue NORTICAM", "Options selon la variante", "Compatibilité à vérifier avant achat"],
    seoDescription: editorial.seoDescription || product.seoDescription || null,
    variants,
    shopifyUrl: `https://z4a1f0-p0.myshopify.com/products/${product.handle}`,
  };
});

// Alerter sur les produits sans texte éditorial unique (anti-duplication SEO).
const missingEditorial = products.filter((product) => !overrides[product.handle]);
if (missingEditorial.length > 0) {
  console.warn(`\n[SEO] ${missingEditorial.length} produit(s) sans surcharge éditoriale :`);
  for (const product of missingEditorial) console.warn(`  - ${product.handle}`);
  console.warn("Ajoutez-les dans overrides.json pour sortir du contenu dupliqué.\n");
}

// Produits à mettre en avant sur la page d'accueil et dans le comparatif.
const preferredHandles = ["dashcam-3k-voiture", "dashcam-wifi-5ghz", "dashcam-4k-avant-arriere"];
const preferred = preferredHandles.filter((handle) => products.some((product) => product.handle === handle));

const content = `/**
 * Catalogue issu de Shopify le ${new Date().toISOString()}.
 * Design reference: NORTICAM storefront — catalogue réel synchronisé depuis Shopify.
 * Les textes marketing uniques vivent dans scripts/editorial-overrides.json
 * et sont injectés par scripts/sync-shopify-catalog.mjs.
 */

export type VariantOption = { name: string; value: string };
export type ProductVariant = { id: string; numericId: string; title: string; availableForSale: boolean; price: number; options: VariantOption[]; image: string | null };
export type Product = { id: string; handle: string; title: string; shortTitle: string; vendor: string; productType: string; type: "Dashcam" | "Accessoire"; price: number; available: boolean; image: string | null; imageAlt: string; badge: string; description: string; story: string; details: string[]; seoDescription: string | null; variants: ProductVariant[]; shopifyUrl: string };

export const products: Product[] = ${JSON.stringify(products, null, 2)};
const priorityHandles = ${JSON.stringify(preferred.map((product) => products.find((p) => p.handle === product)?.handle ?? product))};
export const dashcams = products.filter((product) => product.productType.toLowerCase().includes("dashcam")).sort((left, right) => { const leftIndex = priorityHandles.indexOf(left.handle); const rightIndex = priorityHandles.indexOf(right.handle); return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex); });
export const accessories = products.filter((product) => product.productType.toLowerCase().includes("accessoire"));
export const featuredDashcams = priorityHandles.map((handle) => products.find((product) => product.handle === handle)).filter((product): product is Product => Boolean(product));
export const productByHandle = (handle?: string) => products.find((product) => product.handle === handle);
export const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
`;

fs.writeFileSync(target, content);
console.log(`Catalogue synchronisé (${isCsv ? "CSV" : "JSON"}) : ${products.length} produits publiés écrits dans ${target}`);
console.log(`Produits mis en avant : ${preferred.join(", ") || "aucun"}`);
