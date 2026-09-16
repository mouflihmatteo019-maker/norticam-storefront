# Livraison SEO — septembre 2026

Base : GitHub main `f88092094cbcb0ffb400b342e2ed2d54bd1f4671`.
Branche : `seo-qualified-traffic`. Aucun déploiement ou changement Shopify Admin.

## Intentions et absence de nouvelles pages concurrentes

Une intention commerciale principale conserve une URL de référence :

| Intention | Page de référence | Contenu de soutien distinct |
| --- | --- | --- |
| Acheter une dashcam voiture | /dashcam-voiture/ | Guide débutant /conseils/quelle-dashcam-voiture-choisir/ |
| Choisir la meilleure selon l’usage | /meilleure-dashcam/ | Quiz ; l’ancien /conseils/meilleure-dashcam-voiture/ redirige en 301 |
| Acheter une 4K | /dashcam-voiture-4k/ | Compromis 2K/4K, pas un deuxième classement |
| Acheter un kit double caméra | /dashcam-avant-arriere/ | Explication des angles et du montage |
| Acheter pour le stationnement | /mode-parking/ | Alimentation et batterie, pas une seconde collection |
| Acheter pour les trajets nocturnes | /dashcam-vision-nocturne/ | Plaques, reflets et limites de l’image |
| Acheter une dashcam GPS | /dashcam-gps/ | Fonctions utiles et limites du GPS |
| Acheter une dashcam moto | /dashcam-moto/ | Montage, caméra portée/fixe et compatibilité |
| Comprendre « sans fil » | /conseils/dashcam-sans-fil/ | Nouvelle page : Wi-Fi versus alimentation et accès distant |
| Préparer un montage discret | /conseils/dashcam-voiture-discrete/ | Nouvelle page : encombrement, fixation et câbles |

Pas de nouvelle collection « sans fil », « discrète », « meilleure 2026 », ni de série de variantes lexicales. Les comparatifs entre deux modèles répondent à des requêtes précises et renvoient aux fiches. Des thèmes peuvent se recouper sans viser la même intention. L’absence effective de cannibalisation devra être suivie dans Search Console par requête et URL après indexation ; elle ne peut pas être garantie par un test de code.

## Recherche de mots-clés

Ubersuggest consulté le 16 septembre 2026, français / France :
- dashcam : estimation 33 100 recherches, difficulté affichée 23 ; les résultats restent dominés par des domaines établis.
- dashcam voiture : 18 100 ; dashcam moto : 2 400 — catégories existantes conservées.
- dashcam sans fil : 2 400 ; sans fil rechargeable : 590 ; sans fil voiture : 260 — une seule page explicative, pas trois pages.
- quel dashcam choisir : 320 — guide existant, pas un nouvel article redondant.

Ce sont des estimations de l’outil, pas des prévisions de visites. Aucun volume spécifique vérifié pour « dashcam discrète » : le choix s’appuie aussi sur les impressions observées de l’ancien article dans Search Console. Aucune garantie de classement rapide.

Référence de recherche : https://app.neilpatel.com/fr/ai-keyword-overview
Documentation de pré-rendu : https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
Alimentation et surveillance à l’arrêt, documentation fabricant : https://www.70mai.com/instructions/70maiHardwireKit_4G_UP04_UserManual.pdf

## Corrections techniques

`pnpm build` génère désormais le HTML avec les composants React réellement affichés, et un catalogue lu depuis l’API publique au build. Le build échoue si ce catalogue est indisponible : aucune offre inventée n’est publiée. Les prix et disponibilités sont revalidés côté client et au panier ; les pages statiques doivent être reconstruites après un changement de catalogue.

Les routes des guides et comparatifs existent côté serveur ET côté navigateur. Le sitemap ne contient que les routes indexables ; pas de dates de modification inventées à chaque build. Les liens internes utilisent directement le slash final. Le serveur Express redirige www vers l’hôte canonique, conserve les vraies 404 et sert les variantes Brotli/gzip produites au build. Les assets hachés ont un cache long ; le HTML est revalidé.

Les fiches ne publient pas de Product incomplet pendant la vérification du catalogue. Les avis fictifs sont désactivés en build public, sans retirer les composants. Pour une visualisation locale seulement : `VITE_PREVIEW_REVIEWS=true` avec `pnpm dev`.

## Actions externes restantes

- Le domaine Search Console englobe aussi les sous-domaines : ses statistiques ne sont pas un compteur distinct de `checkout.norticam.com`.
- Les anciens articles Shopify sur le sous-domaine nécessitent un traitement SUR CET HÉBERGEMENT. Une redirection dans le serveur du domaine principal ne peut pas les corriger. Préparer et valider des redirections exactes en préservant les chemins de checkout, comptes et commandes ; ne pas rediriger tout le sous-domaine.
- Correspondances candidates après validation : ancien blog `meilleure-dashcam-voiture` → `/meilleure-dashcam/` ; `dashcam-voiture-discrete` → `/conseils/dashcam-voiture-discrete/` ; `mode-parking-dashcam` → `/conseils/dashcam-mode-parking-guide/`. Ne pas rediriger les autres anciens articles vers l’accueil par défaut.
- Pendant le test, le logo du checkout renvoyait encore vers `z4a1f0-p0.myshopify.com`. Le corriger côté configuration checkout/thème, pas par une modification du storefront ou une redirection globale du sous-domaine.
- Contact : la page prépare un email vers `contact@norticam.com`, avec validation des champs. Elle ne prétend pas envoyer depuis le serveur. Un envoi direct nécessite la configuration du fournisseur de messagerie côté serveur (et protection anti-abus), jamais un mot de passe dans VITE_*.
- Le suivi colis est accessible depuis le menu mais son endpoint sécurisé reste non configuré : la page affiche honnêtement ce blocage, aucun statut fictif.
- `purchase` requiert la source de commande confirmée et les accès de mesure ; aucun événement purchase n’a été ajouté à un clic checkout.
- Nouveau logo original conservé dans `client/public/norticam-logo.png`, recadré visuellement par CSS sans retouche du fichier.

## Avant production

1. Valider la préproduction visuellement et les parcours d’achat ; ne pas fusionner automatiquement main.
2. Configurer le mail et le suivi si l’envoi direct et la recherche de commande sont requis au lancement.
3. Traiter les anciennes URL du sous-domaine dans Shopify, puis refaire un crawl complet, JavaScript activé, et vérifier les URL choisies par Google.

Contrôles reproductibles : `pnpm check`, `pnpm test`, `pnpm build`, `node scripts/audit-seo.mjs`.

## Résultats vérifiés

- TypeScript : réussi. Tests unitaires : 21 réussis. Build : 55 pages générées.
- Audit HTML : 51 URL indexables, 22 offres produit, 2 427 occurrences de liens internes vérifiées, zéro échec. Pas d’AggregateRating ni de faux avis dans le build public.
- HTTP local : pages publiques 200, URL inexistante 404, ancien guide meilleure dashcam 301 vers la sélection, hôte www 301 vers norticam.com en conservant chemin et query.
- Compression réellement servie : HTML accueil gzip ~8,5 Ko ; guide sans fil ~7,3 Ko (mesures locales, pas un score Core Web Vitals).
- Navigateur : contrôles mobile 390 px et desktop 1 440 px sur accueil, catégorie, produit, nouveaux guides, comparatif, contact et 404. Aucun débordement détecté dans ces contrôles ; pas d’erreur JavaScript observée dans les journaux consultés.
- Contact : champs obligatoires bloquants à vide. Menu mobile → suivi : OK. Suivi non connecté : message explicite, aucun faux résultat.
- Produit A510 → panier réel : 149,90 € au moment du test ; passage sur checkout.norticam.com confirmé. Aucune identité client saisie, aucune commande passée.
- Quiz moto/casque : bug préexistant de classement corrigé, test unitaire ajouté et parcours navigateur rejoué jusqu’à une caméra de casque (MOMAN H4C au moment du test).
- Le logo fourni a été contrôlé visuellement sur mobile et desktop. Son original n’a pas été redessiné.

La réception d’un email réel, la recherche d’une vraie commande, l’événement purchase, les changements de classement Google et les performances en conditions de trafic réel ne sont pas validés par ces tests locaux.
