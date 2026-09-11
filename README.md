# NORTICAM — storefront Shopify

Interface premium React/Vite, catalogue et panier connectés à Shopify Storefront API. Le checkout reste hébergé par Shopify. Le HTML indexable est pré-rendu depuis les vraies données du catalogue.

Consulter [LAUNCH.md](LAUNCH.md) pour les prérequis, les variables publiques, les tests et les conditions de mise en production.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm start
```

Le build produit `dist/public` (hébergement statique avec `.htaccess`) et `dist/index.js` (serveur Node avec vraies 404). Aucun ancien ZIP de `release/` ne représente cette version : reconstruire avant déploiement.

Travail sur `astra-launch-ready`, sans publication en production. Valider les informations commerciales et légales, la commande de test et le suivi d’achat avant fusion/déploiement. Aucun secret privé ne doit être exposé dans une variable VITE.
