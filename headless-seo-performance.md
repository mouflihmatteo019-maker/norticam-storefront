# NORTICAM — Rattrapage SEO du storefront déployé

## Résultat obtenu

Le storefront conserve le design validé et le panier Shopify, mais ses pages publiques ne reposent plus exclusivement sur l’exécution JavaScript pour exposer leur contenu. À chaque build, les pages principales, les catégories, les guides et chaque fiche de produit synchronisée génèrent maintenant un document HTML indexable. Chaque document contient un titre, une description, un contenu lisible sans JavaScript et les données structurées adaptées au type de page.

| Élément | État après correction |
|---|---|
| Accueil, boutique, catégories, comparatif, quiz et conseils | Pré-rendus au build |
| Fiches produit synchronisées | Pré-rendues avec prix, disponibilité, image et JSON-LD Product |
| Guides | Pré-rendus avec contenu éditorial et JSON-LD Article |
| HTML produit livré sans JavaScript | Contrôlé localement |
| Tiroir panier et redirection Shopify | Conservés côté client |
| Runtime de prévisualisation dans le build visiteur | Retiré |
| URL canoniques et sitemap absolus | Activés au prochain build dès que `VITE_SITE_URL` est défini |

## Gain technique observé

Le document d’accueil du build est passé de **374 023 octets** à **7 071 octets**, soit une réduction d’environ **98,1 %** du HTML initial. Ce gain vient du retrait des outils de prévisualisation de la production ; ils restent disponibles pendant le développement et n’affectent plus les visiteurs ni les robots.

Le bundle JavaScript d’interaction reste nécessaire pour les filtres, le quiz, le tiroir panier et la redirection Shopify. Toutefois, l’information commerciale principale est désormais visible et indexable avant son exécution.

## Limite à conserver en tête

Le domaine public final n’est pas encore défini. Pour éviter de générer des canoniques ou un sitemap vers une adresse provisoire, le build attend la variable `VITE_SITE_URL`. Dès qu’elle contient le domaine de publication final, il produit automatiquement les balises canoniques, les URL Open Graph absolues et `sitemap.xml`.
