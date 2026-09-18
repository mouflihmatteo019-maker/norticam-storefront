# Revue d’indexation du 18 septembre 2026

## Constat Google

Le rapport global Search Console est daté du 14 septembre : 113 URL indexées et 54 exclusions. Il couvre le domaine entier, donc aussi www et checkout, et ne correspond pas à 54 pages commerciales bloquées.

- 20 doublons : dernière exploration le 5 septembre. Exemple inspecté : `/produits/dashcam-voiture-360-4k/`, canonique déclarée sans www, canonique Google avec www. Le test en direct du 18 septembre confirme que la page peut être indexée.
- 4 URL explorées non indexées : catégorie `/dashcam-moto-casque/`, ancien produit sans slash et deux flux Atom sur checkout. L’inspection individuelle de la catégorie confirme maintenant « Cette URL est sur Google ».
- 2 soft 404 : `/conseils/` et `/produits/dashcam-voiture-mini-2k/`. Les deux inspections individuelles confirment maintenant que ces pages sont indexées.
- 2 erreurs de redirection : `/comparatif` et `/dashcam-voiture`. Vérifiées en direct : 301 vers la même URL avec slash, puis 200.
- 4 vraies 404 : `/v1/produce`, `/cdn`, `/b`, `/wpm` sur checkout.norticam.com. Il s’agit de chemins techniques, pas de pages commerciales à recréer ou rediriger vers l’accueil.
- 9 pages détectées en attente dans le rapport : comparateur, trois comparatifs et cinq fiches produit. Toutes appartiennent au sitemap actuel et passent l’audit HTTP.

## Actions et contrôles

- Validation Search Console démarrée le 18 septembre pour les 20 doublons et les 2 erreurs de redirection.
- Demande individuelle de réindexation tentée pour la X800 : refus temporaire « Quota dépassé ». Pas de contournement du quota.
- Audit des 51 URL du sitemap en ligne : 200, URL finale inchangée, canonique unique identique au sitemap, un H1, indexation autorisée.
- Audit des 51 variantes www : toutes redirigent en 301 vers la bonne URL sans www.
- Correction des alias `/index.html` et normalisation des routes existantes avant la livraison du HTML, en conservant les paramètres d’URL. Ces alias servaient un HTML valide mais déclenchaient ensuite une page introuvable dans React.
- Enrichissement de la catégorie casque existante : critères montage/intercom/recharge, choix par usage, deux références réelles, FAQ et maillage. Aucun nouveau doublon éditorial créé.
- Tests locaux des redirections, paramètres et vraies 404 ; 21 tests applicatifs ; compilation ; audit des 51 pages générées et 2 606 liens internes.

Google doit réexplorer et réévaluer les URL avant que les rapports globaux ne reflètent le nouvel état. Une validation démarrée n’est pas une confirmation d’indexation. Ne pas chercher à indexer les anciennes variantes, flux et chemins techniques.
