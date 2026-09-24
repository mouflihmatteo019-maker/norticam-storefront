# NORTICAM — adaptation Shopify, branche de prévisualisation

Base : `main` au commit `2c63b79147110b49960835ebfccaa99c6d4a458a`.
Ne pas fusionner cette branche dans `main` et ne pas publier le thème avant recette Shopify.

## Pourquoi Shopify refusait la branche

La copie initiale du dépôt contenait le storefront React, sans `layout/theme.liquid` à la racine. Shopify ne construit pas un projet Vite lors d'une connexion GitHub. Cette branche fournit désormais directement `layout/`, `templates/`, `sections/`, `snippets/`, `config/`, `locales/` et `assets/` à la racine. Les sources React restent disponibles pour maintenance.

## Installation en brouillon

1. Actualiser Shopify > Boutique en ligne > Thèmes > Connecter depuis GitHub.
2. Choisir `mouflihmatteo019-maker/norticam-storefront`, branche `shopify-native-faithful`.
3. Ajouter à la bibliothèque, **sans publier**. Ouvrir l'aperçu Shopify.
4. Vérifier les produits publiés sur le canal Boutique en ligne.
5. Créer/associer les pages et collections décrites dans `release/shopify-resources.json`. Ces ressources appartiennent à la boutique, pas au thème : GitHub ne les crée pas. Le template par défaut suffit. Ne pas écraser des pages existantes sans comparaison.
6. Ne pas importer les redirections de `release/shopify-redirects.csv` avant validation du plan de migration. Elles sont nécessaires si le domaine principal bascule vers Shopify ; aucune bascule n'a été faite ici.

## Fidélité et architecture

Les mêmes composants React, textes, images et styles sont utilisés : homepage, collections, fiches produit, quiz, comparateur, guides, menus, panier tiroir et responsive. L'HTML initial est compilé depuis ces composants en Liquid ; les prix sont des expressions Liquid actives. Le runtime React reprend ensuite l'interactivité.

- Catalogue : données Liquid du canal Boutique en ligne ; pas de token privé.
- Panier : Ajax Cart API Shopify, quantités et identifiants de ligne natifs.
- Paiement : `/checkout` sur la boutique courante. Aucun événement purchase fictif.
- Logos de paiement : `shop.enabled_payment_types` et SVG natifs Shopify.
- Contact : formulaire Liquid `contact`, pas de serveur de messagerie à déployer. Vérifier la réception et l'antispam sur l'aperçu Shopify.
- SEO : URL canonique Shopify, Product structured data natif, HTML initial éditorial. Shopify génère son propre sitemap/robots. Les anciennes URL sans préfixe ne peuvent pas rester les URL natives de toutes les pages.
- Consentement : le bandeau existant enregistre les choix dans Customer Privacy API sur clic explicite. Configurer les régions nécessitant un consentement dans Shopify ; utiliser un seul bandeau (ne pas activer un second bandeau automatique en parallèle).
- Analytics : les émetteurs GA/Meta du storefront headless sont désactivés uniquement en mode thème, pour ne pas doubler les pixels Shopify. Configurer Google/Meta dans les canaux/pixels Shopify et vérifier les événements dans leur outil de test. Les événements personnalisés du quiz ne sont pas raccordés aux pixels natifs dans cette adaptation.

## Limites à connaître avant publication

- Ce n'est pas un thème reconstruit en blocs glisser-déposer : la mise en page fidèle est un ensemble React compilé. L'éditeur Shopify affiche le thème, mais les textes/mises en page spécifiques restent modifiables dans le code. Les produits/prix/stocks restent administrés dans Shopify.
- Les 32 ressources Pages/Collections doivent exister. Un template seul ne crée pas une URL Shopify.
- Catalogue actuel : 22 produits. Cette version charge au plus 250 produits et les 50 premières variantes de chaque produit ; ne pas étendre le catalogue au-delà sans adapter la pagination.
- Les changements de prix/stock sont en direct. Après ajout/suppression/réorganisation de produits ou variantes, ou modification éditoriale, reconstruire pour actualiser aussi le HTML initial et les routes compilées.
- La recherche et la page panier dédiée ont un fallback natif simple ; le panier tiroir conserve le design original.
- Suivi de colis : interface existante conservée. La recherche sécurisée par email/commande nécessite toujours son endpoint externe ; aucune réponse de livraison n'est simulée dans le thème.
- La réception contact, le checkout HTTPS réel, le consentement Shopify, les pixels et le rendu final avec les ressources de la boutique nécessitent une recette dans Shopify. Aucun achat ni publication n'a été effectué.

## Maintenance et tests

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm theme:build
pnpm theme:audit
pnpm theme:preview
```

`theme:build` reconstruit les fichiers installables à la racine. Il ne pousse ni ne publie rien.
`theme:preview` lance une simulation Liquid sur `127.0.0.1:4331` et la référence sur `4330`. Son panier est isolé, sans commandes réelles. Les SVG paiement y sont des placeholders ; Shopify produit les vrais SVG. Le garde-fou HTTPS du checkout empêche le clic de paiement dans cette simulation HTTP, et reste volontairement intact.

Contrôles au 23 septembre 2026 : TypeScript OK, 36 tests OK, build storefront et build thème OK, audit structure/routes OK ; validateur officiel Shopify : 76 fichiers valides. Le quiz complet et l'ajout/augmentation du panier ont été exercés dans le navigateur local. Ceci n'est pas encore une recette Shopify réelle.

Documentation : https://shopify.dev/docs/storefronts/themes/tools/github ; https://shopify.dev/docs/api/customer-privacy
