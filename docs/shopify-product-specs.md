# Caractéristiques NORTICAM administrables dans Shopify

État au 6 octobre 2026 : définition marchande JSON `custom.norticam_specs` créée dans Shopify et valeur A510 enregistrée depuis les faits attestés de sa description. La lecture Admin a été contrôlée ; le contrôle visuel après publication reste à effectuer. Les autres produits conservent leur fallback tant qu’aucune valeur vérifiée n’est saisie. Les descriptions, titres SEO, prix, variantes et stocks restent les données natives Shopify. Aucun secret, application privée ou abonnement n’est requis pour ce contrat de thème.

## 1. Définition à créer avant les valeurs

Dans Shopify, Paramètres → Données personnalisées → Produits, créer une définition marchande :

- Nom : Caractéristiques NORTICAM.
- Namespace et clé : `custom.norticam_specs`.
- Type : JSON, sur les produits (PRODUCT).
- Le marchand doit pouvoir modifier le champ depuis la fiche produit.
- Pour un éventuel storefront utilisant GraphQL directement, activer aussi l’accès Storefront en lecture ; le thème natif lit le métachamp via Liquid.

Il s’agit de données appartenant au marchand dans un thème existant, pas de données `$app` appartenant à une application. Ne pas ajouter de faux fichier `shopify.app.toml` ni créer une application uniquement pour ce champ. Une future application nécessitant ses propres définitions doit suivre le modèle app-owned Shopify, séparément de ce contrat de thème.

## 2. Enregistrer les valeurs vérifiées sur le produit

Le JSON ci-dessous est fondé sur les faits A510 présents dans la description Shopify relue le 6 octobre. Cette valeur a été enregistrée uniquement sur ce produit, et non sur les autres. Vérifier la configuration réellement vendue et la notice avant toute nouvelle saisie ; ne pas appliquer cet exemple aux autres produits.

Le même exemple prêt à saisir se trouve dans `docs/examples/a510-norticam-specs.json`. Il conserve les capacités attestées pour ne pas les rendre involontairement inconnues lors du passage à une source autoritative ; ne pas réduire cet objet aux seuls champs microSD/boucle sans vouloir retirer les autres faits.

```json
{
  "version": 1,
  "vehicle": "voiture",
  "mount": "vehicle",
  "facts": {
    "resolution": "3K HDR 2592 × 1944 px",
    "coverage": "Caméra avant et caméra arrière incluse",
    "gps": "GPS intégré",
    "wifi": "Wi-Fi + application 70mai",
    "parking": "Mode parking avec kit d’alimentation 70mai compatible non inclus",
    "night": "Traitement nocturne 70mai avec capteur Sony IMX675",
    "storage": "Carte microSD non incluse : carte compatible à prévoir selon la notice",
    "loop": "Enregistrement en boucle"
  },
  "capabilities": {
    "dual": true,
    "gps": true,
    "wifi": true,
    "parking": true,
    "night": true,
    "loop": true
  },
  "kit": [
    "Caméra arrière incluse",
    "Carte microSD non incluse",
    "Kit d’alimentation parking non inclus"
  ]
}
```

Une capacité doit être `true` uniquement lorsqu’elle est réellement documentée pour la configuration décrite. `false` signifie explicitement non proposée ; `null` ou champ omis signifie inconnu, pas « non ». Pour les fonctions conditionnelles, indiquer le kit ou l’alimentation requis dans le texte correspondant. Rotation de caméra ne signifie pas capture simultanée de tous les angles. HDR seul ne prouve pas une fonction nocturne.

Les données décrivent le produit/la configuration commune, pas toutes les variantes indistinctement. Si des kits diffèrent, expliquer les conditions ; ne pas marquer caméra arrière/carte/kit inclus pour toutes les variantes si cela dépend de l’option. Une prochaine extension par variante nécessiterait un contrat explicite distinct.

## 3. Lecture et utilisation

Le snippet catalogue sérialise uniquement un métachamp de type `json`, via sa propriété `.value` et le filtre `json`, vers la propriété catalogue `norticamSpecs`. Avec un jeton public autorisant `unauthenticated_read_metafields`, le Storefront GraphQL lit la même clé avec l’alias `norticamSpecs` et reçoit `{ type, value }` ; le parseur accepte ces deux enveloppes. Sans jeton, le build et le storefront legacy omettent ce champ interdit et conservent leur fallback éditorial. Cela ne désactive pas la lecture Liquid du thème natif. [Objet metafield Liquid](https://shopify.dev/docs/api/liquid/objects/metafield), [accès Storefront avec ou sans jeton](https://shopify.dev/docs/api/storefront/2026-07).

Le parseur dans `client/src/lib/product-specs.ts` valide les types, la version, les longueurs et le texte brut avant utilisation. Les attributs inconnus sont ignorés et ne peuvent pas remplacer un prix, un stock, un identifiant, une variante, du HTML de description ou du SEO natif.

Les données alimentent les caractéristiques/comparaisons, critères GPS/Wi-Fi/nuit/parking/avant-arrière, montage casque et recommandation du quiz, contenu du kit et FAQ. La source valide est autoritative : un champ omis ne réactive pas une ancienne caractéristique du catalogue code. Les textes non documentés comme capacités ne deviennent pas des bénéfices techniques. Le titre et la description Shopify restent inchangés.

## Contrat version 1

| Champ | Format | Règle |
| --- | --- | --- |
| `version` | Nombre `1` | Obligatoire |
| `vehicle` | `voiture` ou `moto` | Optionnel ; sinon type de produit actuel Shopify, si explicite |
| `mount` | `helmet` ou `vehicle` | Optionnel ; une source structurée ne reprend pas le vieux montage par handle |
| `facts` | Objet de textes bruts | Clés : resolution, coverage, gps, wifi, parking, night, storage, sensor, imageProcessing, power, protection, loop, rotation, carplay |
| `capabilities` | Objet de `true` / `false` / `null` | Clés : dual, gps, wifi, parking, night, loop, rotation, carplay |
| `details` | Liste de textes bruts | Optionnelle, 30 éléments maximum ; mentions de fonctions filtrées selon les capacités documentées |
| `kit` | Liste de textes bruts | Optionnelle, 20 éléments maximum ; conserve aussi « non inclus »/« vendu séparément » |

Chaque texte a au maximum 500 caractères, est non vide après nettoyage des espaces et n’accepte pas de balises HTML. Dans l’enveloppe GraphQL, la valeur JSON a une limite locale de 16 000 caractères.

Les capacités possèdent des libellés d’affichage distincts : absence → « Non précisé »/« Non documenté » ; négation explicite → « Non ». Les anciens filtres utilisant le préfixe `Non` continuent d’exclure correctement les fonctions non confirmées. Le quiz ne recommande pas un produit pour la priorité nuit lorsque cette capacité n’est pas documentée.

## Fallback et suppression

- Métachamp absent, mauvaise version ou format invalide : fallback éditorial existant par ID Shopify stable ; produit inconnu → aucune caractéristique inventée.
- Métachamp valide, même réduit à `{ "version": 1 }` : aucune ancienne caractéristique réinjectée. Les champs manquants sont affichés comme non précisés. Ne pas publier un objet vide involontairement.
- Liste `kit: []` : aucune ancienne liste de kit réinjectée.
- Suppression du métachamp : retour au fallback existant, pas à la dernière valeur administrée. Pour conserver une source administrable mais désactiver une fonction, enregistrer explicitement la capacité `false` ou `null`.
- Format invalide : revalider la saisie avant lancement ; une définition JSON Shopify valide la syntaxe JSON, pas tout le contrat NORTICAM.

Le fallback A510 a reçu uniquement les deux omissions déjà vérifiées : carte microSD non incluse et enregistrement en boucle. Aucun fait nouveau n’a été ajouté aux autres produits.

## Tests locaux

`client/src/lib/product-specs.test.ts` couvre enveloppes native/GraphQL, formats invalides, source autoritative, produit nouveau, prix/stock intacts, filtres/quiz, montage, kit/FAQ, fonctions inconnues ou négatives, A510 et critères rotation/CarPlay. L’API a confirmé l’enregistrement A510, mais ces tests locaux ne prouvent pas un rendu navigateur ni la synchronisation du thème publié.

## Tracking et avis : limites séparées

Les changements de faits ne publient aucun événement commercial et ne touchent ni aux pixels ni aux conversions. Ne pas ajouter un second `purchase`, `view_item`, `add_to_cart` ou `begin_checkout` par cette architecture. Le suivi précis du quiz/drawer/contact nécessite une instrumentation native consentie et testée séparément, sans données personnelles.

`node scripts/reviews-production-off-check.mjs` lance désormais les tests de configuration : les fixtures d’avis sont désactivées par défaut et restent bloquées sur un hôte public même avec le flag preview `true`. Le script ne teste plus « 100 avis » et ne prétend plus qu’un flag public est actif. Il ne s’agit pas d’un audit navigateur/structured data ; aucun faux avis n’est activé en production.
