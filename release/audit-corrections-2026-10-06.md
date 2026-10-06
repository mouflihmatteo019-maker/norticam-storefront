# Corrections de l’audit NORTICAM — 6 octobre 2026

Base : branche `shopify-native-faithful`, commit `59602857ecc135b03f26ca16051760dedb269f62`. Tag local de sauvegarde : `audit-baseline-20261006`. Publication sur la branche live autorisée par le propriétaire après les tests. La confirmation distante et HTTP est consignée séparément après publication ; ce document n’en est pas une preuve à lui seul.

## Réalisé

- SEO Shopify : 30 ressources mises à jour et relues (14 articles, 5 anciennes pages, 11 collections). Titres et descriptions distincts, phrases complètes ; aucun changement de handle, URL, H1, prix, stock ni variante.
- Pages livraison/retours : ancien email remplacé par `contact@norticam.com`, livraison alignée sur la politique déjà publiée (France métropolitaine), absence d’horaires inventés. Adresse de retour laissée vide à la demande du propriétaire. Lien CGV ancien en 404 remplacé par la page CGV existante.
- Collections 360 et CarPlay moto : critères, limites, FAQ et recommandations distincts, liens depuis les catégories parentes, sans nouvelles pages synonymes ni faux essais terrain.
- Images : un seul paramètre `width`, tailles adaptées aux cartes/galeries/vignettes, srcset hero responsive, originaux conservés. Sept ALT corrigés directement dans Shopify sur MOMAN H4C et DDPAI MINI Pro, sans vision 360° ni résolution non confirmée.
- Premier affichage du thème : pages natives importées synchroniquement, catalogue Liquid prêt sans rechargement initial redondant. La version headless conserve son chargement et ne demande pas les métachamps sur l’API tokenless.
- Accessibilité : contrastes ciblés du CTA hero, petites accroches, textes de section et footer. Structure, dimensions, polices et images du design conservées. Les polices déjà empaquetées restent stables lors des builds ; renouvellement délibéré via `NORTICAM_REFRESH_FONTS=true`.
- Faits produit : définition marchande JSON `custom.norticam_specs` créée dans Shopify, renseignée et relue pour A510 uniquement à partir de sa description actuelle. Enregistrement valide prioritaire, inconnue distincte de « non », fallback conservé pour les autres modèles. Boucle et carte microSD non incluse cohérentes avec la description.
- Thème SEO natif : liaison des champs SEO Shopify des pages/collections, BreadcrumbList, logo Organization, métadonnées sociales ; pagination réelle des blogs préservée, pages de collection hors bornes noindex. Catalogue de 22 produits isolé du paramètre de pagination du blog. Track123 noindex français seulement lorsqu’il utilise notre layout.
- Mesure des interactions quiz/contact/expiration : événements Shopify `norticam:*` limités, consentement analytics requis, aucune donnée personnelle, aucune duplication des événements commerce natifs. Aucun `purchase` au clic checkout.
- Avis de test : tests de protection corrigés, données fictives toujours bloquées sur les domaines publics et absentes des schémas SEO.

## Tests accomplis avant publication

- `pnpm check` : réussi.
- `pnpm test` : 177/177 tests, 19 fichiers, réussis.
- `pnpm build` et `pnpm theme:build` : réussis ; 56 vues natives, 22 produits réels.
- `pnpm theme:audit` : réussi.
- Validation Liquid officielle via le fallback existant du dépôt : 10/10 fichiers réussis. Le plugin ne résout pas sa dépendance localement ; le fallback utilise les bibliothèques Shopify du dépôt, avec ressources de schéma en cache après avertissement d’accès au cache.
- Revue indépendante des générés : pas de régression bloquante détectée dans les canonicals, schémas, noindex ou pagination. Contrats SSR, états catalogue, logique commerce, consentement, images et avis couverts par tests automatisés.

Les tests navigateur ont été refusés par le contrôle de sécurité de cette session. Aucun nouveau PageSpeed, résultat visuel desktop/mobile, email reçu, fulfillment ou achat attribué n’est déclaré validé. Le bundle IIFE conserve un avertissement de taille >500 kB ; une mesure après publication reste nécessaire.

## Inchangé / à terminer avec le propriétaire

- Les quatre pages utilitaires déjà noindex et la collection vide `frontpage` restent dans le sitemap : mutation `seo.hidden` refusée, non appliquée. Aucune suppression de page ni modification d’indexabilité n’a été faite pour ce point.
- Identité légale, immatriculation, adresse professionnelle/retour, médiation et conditions commerciales définitives : laissées en attente à la demande du propriétaire. Pas de promesse de retours gratuits ajoutée.
- Validation fournisseur des variantes X800/M550, SKU DSers, GTIN/MPN réels et flux Merchant ; aucun identifiant commercial réécrit ou inventé.
- GA4/Ads/Shopify : destination des événements, consentement et achat unique de bout en bout à vérifier dans les comptes. Publication de `norticam:*` ne prouve pas leur mapping GA4.
- Contact et Track123 : réception réelle et commande expédiée autorisée à tester ; données fictives interdites.
- Catalogue >50 produits : fallback existant préservé, isolement de pagination futur à réaliser avant de dépasser ce seuil.
- Track123 peut injecter son propre document ; nos balises ne garantissent pas le nettoyage du head de l’application.
- Avertissement optionnel description de variantes dans le ProductGroup Shopify natif conservé sans doubler le schema Product.
- Google choisit l’indexation ; aucune garantie de classement/délai, demande d’indexation ni désaveu de backlinks n’a été exécutée.

**Lancement publicitaire commercial non validé tant que les informations commerciales et l’attribution d’achat ne sont pas finalisées.** Les sauvegardes Shopify avant/après sont conservées hors du dépôt dans `audits/2026-10-06` ; aucune donnée client ou secret ajouté au thème.
