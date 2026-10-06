# Corrections SEO natives — 6 octobre 2026

Ces corrections de thème sont locales jusqu’à la publication explicite par l’agent principal. Elles ne modifient pas les variantes, stocks, prix, SKU, avis ni redirections. Les opérations Shopify effectuées séparément par l’agent principal sont consignées dans `audit-corrections-2026-10-06.md`.

## Corrections réalisées

- Les titres et descriptions SEO des collections/pages explicitement renseignés dans Shopify (`global.title_tag` / `global.description_tag`) reprennent maintenant `page_title` / `page_description`, y compris pour les anciens métachamps texte. Lorsqu’aucun champ explicite n’existe ou qu’il est vide, les fallbacks éditoriaux existants sont conservés. Aucun H1, routing ni noindex n’est modifié par cette liaison.
- `/apps/track123` et ses sous-chemins : `noindex,follow` et titre/description français lorsqu’ils passent par le layout du thème. La page `/pages/suivi-colis` conserve son `noindex` existant.
- Les pages artificielles `?page=2` et suivantes d’une collection contenant au maximum 50 produits reçoivent un canonical vers leur collection et `noindex,follow`. La vraie pagination des blogs et celle d’une future collection de plus de 50 produits restent intactes.
- Pour un catalogue Shopify de 50 produits ou moins (22 au moment de l’audit), les données du catalogue ne partagent plus le paramètre `page` de la pagination des articles. Le générateur compile également les vues sans wrapper `paginate` dans ce cas.
- Ajout de `BreadcrumbList` sur les ressources indexables natives : produit, collection, blog, article et page. Les chemins utilisent les URL Shopify et le domaine actif ; aucun breadcrumb n’est ajouté sur les pages utilitaires noindex.
- Open Graph et Twitter : titre/description/canonical existants, type article/produit adapté, image native de la ressource ou logo de la marque si aucune image n’est définie.
- Organization : logo réel du thème et contact public déjà existant. Aucune adresse, horaire, certification ni identité commerciale supplémentaire n’est inventée.
- Le JSON produit expose `norticamSpecs` depuis `custom.norticam_specs` uniquement si son type est `json`, sinon `null`. L’agent principal a créé la définition marchande PRODUCT et renseigné l’A510 uniquement à partir de sa description Shopify vérifiée. Les autres produits conservent le fallback existant ; aucune caractéristique inconnue n’est inventée.

## Limites conservées et actions nécessaires

1. **Catalogue de plus de 50 produits** : le fallback paginé précédent (plafond de compilation 250) est conservé afin de ne pas tronquer arbitrairement le catalogue. Son isolement complet du paramètre `page` reste à faire avant de dépasser 50 produits, via une requête catalogue dédiée. Il ne faut pas prétendre que ce cas futur est résolu.
2. **Track123 app proxy** : le layout ne peut pas supprimer les balises anglaises ou dupliquées que l’application injecte elle-même. Certains app proxies peuvent aussi fournir leur propre document. Un contrôle HTTP réel après publication et, au besoin, une configuration côté Track123 sont indispensables ; le test local prouve seulement les balises émises par le thème.
3. **Avertissement description des variantes** : le filtre Shopify `product | structured_data` est conservé sans remplacement de chaîne fragile ni second schéma Product. Shopify émet une description sur ProductGroup, mais pas sur chaque Product de `hasVariant` dans la capture A510. Ce warning optionnel n’est pas déclaré corrigé.
4. **SKU / livraison / retours Merchant Center** : aucun SKU fournisseur n’est remplacé et aucune politique n’est inventée. Les champs doivent être confirmés dans les sources commerciales et le flux marchand avant correction.
5. **Indexation** : les trois URL natives explorées mais non indexées restent un résultat observé de Google, pas une erreur automatiquement effacée par ces modifications. L’indexation et les positions ne sont pas garanties.

## Vérification locale

- 25 tests ciblés réussis : contenu Shopify, bootstrap catalogue, métadonnées natives, champs SEO marchands collections/pages, Track123, canonicals/pagination, JSON-LD, absence de faux avis et échappement des données.
- Le test de pagination est une validation de branche et de rendu Liquid local ; le comportement réel de la plateforme doit être revérifié après publication.
- Validation Liquid officielle via le script fallback du dépôt sur les 9 fichiers modifiés. La résolution du champ SEO utilise le snippet `norticam-seo-field` pour préserver une complexité de layout acceptable. Le helper du plugin ne trouve pas sa dépendance `@shopify/theme-check-common` dans son propre dossier ; le fallback utilise les mêmes bibliothèques officielles du dépôt.
- Le build complet, le contrôle global et la publication sont coordonnés par l’agent principal. Aucun test d’achat réel ou changement navigateur n’a été effectué par ce sous-chantier.
