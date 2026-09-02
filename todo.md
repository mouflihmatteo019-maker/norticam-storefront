# Reproduction NORTICAM — Suivi

- [x] Observer l’onglet déjà ouvert du site de référence et relever les pages, sections, styles et interactions.
- [x] Auditer la branche principale du dépôt GitHub pour récupérer les textes, modèles de produits et composants utiles.
- [x] Définir les routes et les données de démonstration conformes au storefront de référence.
- [x] Construire l’accueil, la boutique, les fiches produit, le comparatif, le quiz et les conseils.
- [x] Implémenter le panier, les filtres et les interactions de navigation utiles.
- [x] Vérifier les rendus desktop et mobile contre le site de référence.
- [x] Corriger les écarts visibles, créer un checkpoint et livrer la prévisualisation.

## Connexion Shopify réelle

- [x] Vérifier les outils disponibles du connecteur Shopify déjà lié à la boutique NORTICAM.
- [x] Récupérer les produits actifs, images, prix, variantes et disponibilités réels.
- [x] Remplacer les données de démonstration sur l’accueil, la boutique, le comparatif, le quiz et les fiches produit.
- [x] Connecter le panier local au lien de panier Shopify prérempli, sans publier le thème Shopify.

## Contrôle du checkout Shopify

- [x] Vérifier l’URL de panier Shopify construite à partir des variantes sélectionnées.
- [x] Rendre visible dans l’interface que le checkout final s’ouvre sur le domaine Shopify.

## Correctif de redirection

- [x] Remplacer l’identifiant GID de variante par son identifiant numérique dans l’URL de panier Shopify.
- [x] Vérifier qu’une vraie variante crée une redirection Shopify sans erreur 404.

## Passe SEO NORTICAM

- [x] Auditer les routes, métadonnées, balises canoniques, indexation et performance du storefront.
- [x] Vérifier les données actuelles de mots-clés et intentions France via les sources SEO connectées.
- [x] Définir des clusters commerciaux et informationnels reliés aux produits voiture et moto.
- [x] Renforcer les pages boutique, produits, comparatif, quiz et guides avec un contenu orienté recherche.
- [x] Ajouter les métadonnées par route, JSON-LD, robots.txt et liens internes utiles.
- [x] Contrôler les pages et le build après optimisation, puis documenter les limites de données restantes.

## À finaliser au moment de la mise en ligne

- [ ] Définir le domaine public final, puis générer le sitemap.xml avec les URLs canoniques définitives.
- [ ] Mettre en place un rendu pré-généré ou serveur pour exposer le HTML et les métadonnées de chaque URL dès la réponse initiale.
- [ ] Relier Google Search Console, soumettre le sitemap et suivre les requêtes / pages qui reçoivent des impressions.

## Rattrapage SEO du storefront déployé

- [x] Auditer le rendu HTML initial, les routes réellement accessibles et les métadonnées visibles sans JavaScript.
- [x] Corriger l’import de page obsolète qui dégrade actuellement le serveur de développement.
- [x] Générer au build des versions HTML indexables pour l’accueil, les catégories, les fiches produit et les guides.
- [x] Préparer la génération d’un sitemap XML à partir du catalogue Shopify synchronisé et des routes éditoriales publiques.
- [x] Vérifier les canoniques, robots, Open Graph et données structurées pour chaque type de page.
- [x] Réduire le HTML et les outils de prévisualisation servis en production, puis contrôler les parcours panier et checkout Shopify.
- [x] Compiler, prévisualiser et documenter les gains obtenus ainsi que les limites du storefront headless.

### Configuration restant à effectuer avant publication

- [ ] Définir `VITE_SITE_URL` dans la configuration de publication avec le domaine public final du storefront : cette seule valeur activera les canoniques absolus et le fichier `sitemap.xml` au prochain build.

## Traduction fidèle vers Shopify

- [ ] Auditer l’application NORTICAM validée et la branche Shopify `shopify-theme-clean`.
- [ ] Mapper les routes accueil, boutique, collections, produit, comparatif, quiz et conseils vers les templates Shopify.
- [ ] Reproduire les tokens visuels, header, footer, tiroir panier et cartes dans le thème Liquid.
- [ ] Recréer les sections et templates Shopify à partir du storefront validé avec leurs réglages éditables.
- [ ] Vérifier les données produit, variantes, panier, checkout et SEO Shopify dans un thème non publié.
- [ ] Pousser une nouvelle branche GitHub Shopify prête à connecter dans l’administration.
