# Avis clients : bascule de préproduction

## Données de validation visuelle

Les 100 avis par produit ne viennent d’aucune commande ni de Shopify. Ils sont générés de façon déterministe dans `client/src/lib/mock-reviews.ts`. Cette source ne contient ni données réelles, ni schéma Review/AggregateRating, ni appel analytics, ni export Shopify.

Le switch est dans `client/src/lib/reviews-config.ts` :

- développement local : le rendu d’avis est automatiquement disponible pour la validation visuelle ;
- build/déploiement : il est désactivé par défaut ;
- préproduction explicitement activée : définir `VITE_PREPROD_REVIEWS=true` ;
- désactivation immédiate : retirer cette variable ou définir `VITE_PREPROD_REVIEWS=false`, puis reconstruire.

## À conserver lorsque les vrais avis arrivent

Conserver `ProductReviews.tsx`, `ReviewStars.tsx`, `reviews.ts` et les tests de comportement. Remplacer seulement l’implémentation de `reviewsFor()` dans `reviews.ts` par un adaptateur de la solution d’avis choisie (Shopify app, service d’avis ou API interne). L’adaptateur doit fournir : `id`, auteur affiché, note, date, titre, texte, statut d’achat vérifié et images autorisées.

Ne publier `AggregateRating`, `Review` ou des événements marketing qu’après réception de données réelles, avec une politique de modération et un identifiant de commande vérifié.

## Suivi de colis

`/suivi-colis/` est une interface sans statuts inventés. Pour l’activer, créer un endpoint serveur protégé et renseigner uniquement son URL publique dans `VITE_ORDER_TRACKING_ENDPOINT`. L’endpoint doit vérifier côté serveur la combinaison numéro de commande + e-mail, ne retourner que la commande correspondante, puis renvoyer son statut réel et les `trackingInfo` Shopify quand ils existent.

Une intégration Shopify Customer/Customer Account authentifiée peut lire les fulfilments ; l’accès anonyme par numéro et e-mail ne doit jamais interroger l’Admin API depuis le navigateur. Le secret Admin et les tokens client restent exclusivement côté serveur.
