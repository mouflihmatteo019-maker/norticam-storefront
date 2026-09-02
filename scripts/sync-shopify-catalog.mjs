import fs from "node:fs";

const source = "/tmp/manus-mcp/mcp_result_b4f6aa2a-e480-469d-a030-89547128d9c0.json";
const target = "/home/ubuntu/norticam-site-reproduction/client/src/lib/store-data.ts";
const payload = JSON.parse(fs.readFileSync(source, "utf8"));
const nodes = payload.result.data.products.nodes;

function shortTitle(title) {
  const chunks = title.split(/\s+[—–-]\s+/);
  return chunks.length > 1 ? chunks[chunks.length - 1].trim() : title.replace(/^Dashcam\s+/i, "");
}

function badge(product) {
  if (/moto/i.test(product.productType)) return "Dashcam moto";
  if (/4k/i.test(product.title)) return "Dashcam 4K";
  if (/avant arrière|avant-arriere/i.test(product.title)) return "Avant & arrière";
  return "Dashcam voiture";
}

const products = nodes.map((product) => {
  const variants = product.variants.nodes.map((variant) => ({
    id: variant.id,
    numericId: variant.id.split("/").pop(),
    title: variant.title,
    availableForSale: variant.availableForSale,
    inventoryQuantity: variant.inventoryQuantity,
    price: Number(variant.price),
    options: variant.selectedOptions,
    image: variant.image?.url ?? null,
  }));
  const purchasable = variants.filter((variant) => variant.availableForSale);
  const price = Math.min(...variants.map((variant) => variant.price));
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
    badge: badge(product),
    description: `${product.productType} sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.`,
    story: `Découvrez ${product.title}. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.`,
    details: ["Produit du catalogue NORTICAM", "Options selon la variante", "Compatibilité à vérifier avant achat"],
    variants,
    shopifyUrl: `https://z4a1f0-p0.myshopify.com/products/${product.handle}`,
  };
});

const preferredHandles = ["dashcam-3k-voiture", "dashcam-avant-arriere", "dashcam-4k"];
const preferred = preferredHandles.map((handle) => products.find((product) => product.handle === handle)).filter(Boolean);

const content = `/**\n * Catalogue issu de Shopify le ${new Date().toISOString()}.\n * Design reference: NORTICAM storefront — catalogue réel synchronisé depuis Shopify.\n */\n\nexport type VariantOption = { name: string; value: string };\nexport type ProductVariant = { id: string; numericId: string; title: string; availableForSale: boolean; inventoryQuantity: number; price: number; options: VariantOption[]; image: string | null };\nexport type Product = { id: string; handle: string; title: string; shortTitle: string; vendor: string; productType: string; type: "Dashcam" | "Accessoire"; price: number; available: boolean; image: string | null; imageAlt: string; badge: string; description: string; story: string; details: string[]; variants: ProductVariant[]; shopifyUrl: string };\n\nexport const products: Product[] = ${JSON.stringify(products, null, 2)};\nconst priorityHandles = ${JSON.stringify(preferred.map((product) => product.handle))};\nexport const dashcams = products.filter((product) => product.productType.toLowerCase().includes("dashcam")).sort((left, right) => { const leftIndex = priorityHandles.indexOf(left.handle); const rightIndex = priorityHandles.indexOf(right.handle); return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex); });\nexport const accessories = products.filter((product) => product.productType.toLowerCase().includes("accessoire"));\nexport const featuredDashcams = priorityHandles.map((handle) => products.find((product) => product.handle === handle)).filter((product): product is Product => Boolean(product));\nexport const productByHandle = (handle?: string) => products.find((product) => product.handle === handle);\nexport const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);\n`;

fs.writeFileSync(target, content);
console.log(`Catalogue synchronisé : ${products.length} produits actifs écrits dans ${target}`);
