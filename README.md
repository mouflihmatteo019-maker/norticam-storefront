# NORTICAM storefront

Storefront headless Shopify pour norticam.com (dashcams voiture et moto).

## Stack

- Vite + React + TypeScript
- Shopify Storefront API (catalogue, panier, checkout)
- Pré-rendu SEO des pages catalogue et éditoriales

## Démarrage

```bash
pnpm install --frozen-lockfile
cp .env.example .env   # renseigner les variables publiques
pnpm exec playwright install chromium
pnpm dev
```

## Scripts utiles

- `pnpm check` — types
- `pnpm test` — tests unitaires
- `pnpm build` — build + pré-rendu
- `pnpm start` — serveur local sur le build
- `node scripts/launch-audit.mjs` — audit des pages générées

Voir `LAUNCH.md` et `FINAL-OWNER-ACTIONS.md` avant toute mise en production.
