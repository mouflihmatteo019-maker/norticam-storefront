# Base SEO NORTICAM — France

## Données de recherche disponibles

Les données ci-dessous ont été interrogées dans Ubersuggest pour la France (`locId 2250`), le 2 septembre 2026. Elles servent à orienter les pages du storefront ; elles ne constituent pas encore des données de performance organique de NORTICAM, dont l’historique d’indexation n’est pas disponible dans le projet.

| Requête | Volume mensuel France | Difficulté SEO | Lecture d’intention |
|---|---:|---:|---|
| `dashcam voiture` | 18 100 | 17 | Intention commerciale dominante |
| `caméra embarquée voiture` | 4 400 | 19 | Recherche commerciale et explicative |
| `dashcam moto` | 2 400 | 16 | Recherche commerciale avec besoin d’orientation |
| `dashcam voiture 360` | 1 600 | 18 | Sous-catégorie commerciale spécifique |
| `dashcam voiture sans fil` | 880 | 22 | Sous-catégorie commerciale spécifique |
| `meilleur dashcam voiture` | 590 | 18 | Comparatif / pré-achat |
| `dashcam voiture avant arrière` | 590 | 18 | Produit / configuration commerciale |
| `dashcam voiture avant arrière` | 480 | 19 | Produit / configuration commerciale |
| `dashcam avant arrière` | 720 | 17 | Transactionnelle |
| `dashcam voiture 4k` | 70 | 44 | Sous-catégorie à potentiel plus sélectif |

## Observations SERP

Pour `dashcam voiture`, le SERP mélange un guide de choix, des contenus relatifs au cadre d’usage et des pages de catégories commerciales. Pour `dashcam moto`, le premier résultat organique est une page de collection commerciale et le SERP présente aussi un besoin de conseils d’installation et de comparaison.

| Requête analysée | Exemples de résultats organiques observés | Conséquence éditoriale |
|---|---|---|
| `dashcam voiture` | [Norauto — guide de choix](http://www.norauto.fr/e/quelle-dashcam-choisir.html), [CameraSurveillance.net — page commerciale](http://www.camerasurveillance.net/21-camera-embarquee-voiture-dashcam-hd.html), [Allcam — collection mode parking](http://www.allcam.fr/collections/dashcams-mode-parking) | Associer une page catégorie à un guide de choix et à un contenu consacré aux configurations / au stationnement. |
| `dashcam moto` | [Allcam — collection dashcams moto](http://www.allcam.fr/collections/dashcams-moto), [Midland — page produit](http://fr.midlandeurope.com/fr_FR/details/bike-guardian-pro), [Aoocci — guide moto](http://aoocci.fr/blogs/evaluation-comparaison/utiliser-une-dashcam-sur-une-moto-lisez-ceci-dabord) | Faire coexister une catégorie moto, une intention produit et une page-guide d’installation / de comparaison. |

### Sources consultées

- Ubersuggest, `keyword_suggestions`, France (`locId 2250`), interrogé le 2 septembre 2026.
- Ubersuggest, `serp_analysis` pour `dashcam voiture` et `dashcam moto`, France (`locId 2250`), interrogé le 2 septembre 2026.

## Repère technique : boutique Shopify actuelle

L’audit PageSpeed Ubersuggest du domaine Shopify actuel (`z4a1f0-p0.myshopify.com`), interrogé le 2 septembre 2026, a retourné les mesures de laboratoire suivantes. Elles décrivent la boutique actuellement servie par Shopify et ne constituent pas une mesure du storefront de prévisualisation Manus.

| Support | FCP | LCP | TTI | TBT | CLS | Opportunité principale |
|---|---:|---:|---:|---:|---:|---|
| Ordinateur | 625 ms | 1,0 s | 1,1 s | 0 ms | 0 | Réduire les redirections : gain estimé 190 ms |
| Mobile | 2,3 s | 3,2 s | 3,2 s | 0 ms | 0 | Réduire les redirections : gain estimé 630 ms |

Le storefront reconstruit applique donc le chargement différé aux images secondaires, priorise le visuel principal et découpe le code par route. Une mesure sur le domaine final sera requise après mise en ligne pour confirmer les Core Web Vitals du nouveau storefront.

## Validation du storefront après optimisation

Les routes d’accueil, de catégorie voiture, de catégorie moto, de guide et de fiche produit ont été vérifiées en format ordinateur et mobile. Les titres, contenus, liens internes et cartes restent lisibles aux deux formats. Le visuel principal de la fiche produit est chargé en priorité ; les cartes secondaires restent chargées à la demande.

Certains produits actifs du catalogue Shopify ne comportent pas encore d’image synchronisée. Le storefront conserve alors une surface neutre plutôt que d’inventer un visuel. Compléter ces médias directement dans Shopify améliorera à la fois la qualité de la page produit et l’éligibilité à la recherche d’images.

## Décisions appliquées au storefront

1. L’accueil cible le socle sémantique **dashcam voiture et moto** et dirige vers les catégories, le comparatif et le quiz.
2. Les catégories, le comparatif et les fiches produits portent des titres et descriptions propres plutôt qu’une même métadonnée générique.
3. Trois guides de fond couvrent les requêtes de choix voiture, avant-arrière et moto ; ils relient chaque intention informationnelle à une catégorie commerciale pertinente.
4. Les images du catalogue Shopify reçoivent des attributs d’accessibilité et de chargement différé ; le visuel principal est priorisé.

## Limites à lever avant publication SEO

- Définir le domaine canonique final de NORTICAM afin de produire un `sitemap.xml` et des balises canonical définitives.
- Mettre en place une génération pré-rendue ou serveur pour que chaque URL publie son HTML et ses métadonnées sans dépendre de l’exécution JavaScript.
- Connecter Google Search Console après mise en ligne afin de suivre indexation, requêtes, clics, couverture et Core Web Vitals réels.
