#!/usr/bin/env node
/**
 * Applique les surcharges éditoriales versionnées dans GitHub au catalogue déjà
 * synchronisé. Ce script n’appelle aucune API : il est donc sûr à exécuter sur
 * la plateforme de déploiement avant chaque build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "client/src/lib/store-data.ts");
const overridesPath = path.join(root, "scripts/editorial-overrides.json");

if (!fs.existsSync(overridesPath)) {
  console.log("[editorial] Aucun fichier de surcharges : catalogue conservé.");
  process.exit(0);
}

const source = fs.readFileSync(catalogPath, "utf8");
const prefix = "export const products: Product[] = ";
const suffix = ";\nconst priorityHandles =";
const start = source.indexOf(prefix);
const end = source.indexOf(suffix, start);

if (start === -1 || end === -1) {
  throw new Error("[editorial] Impossible de trouver la liste products dans store-data.ts.");
}

const products = JSON.parse(source.slice(start + prefix.length, end));
const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf8"));
let applied = 0;

for (const product of products) {
  const editorial = overrides[product.handle];
  if (!editorial) continue;
  for (const field of ["badge", "description", "story", "details", "seoDescription"]) {
    if (editorial[field] !== undefined) product[field] = editorial[field];
  }
  applied += 1;
}

const nextSource = `${source.slice(0, start + prefix.length)}${JSON.stringify(products, null, 2)}${source.slice(end)}`;
fs.writeFileSync(catalogPath, nextSource);
console.log(`[editorial] ${applied} surcharge(s) appliquée(s) au catalogue pour ce build.`);
