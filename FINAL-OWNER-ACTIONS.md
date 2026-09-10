# Final CRO pass — 10 septembre 2026

## BLOCKED — OWNER ACTION REQUIRED

- Mise en production : accord explicite requis ; aucune fusion main ni publication autorisée dans ce run.
- Merchant Center : connecter le compte et vérifier le flux réel (identifiants, GTIN/MPN si fournis par le fabricant, pays, devise, livraison et retours). Les liens produits du flux doivent cibler `/produits/handle/?variant=ID_NUMERIQUE_SHOPIFY` ; la page sélectionne désormais cette variante et n’en substitue pas une autre si elle manque. Le HTML statique initial reste celui de la configuration par défaut : valider le rendu des URL de variantes dans Merchant Center avant activation, et prévoir un rendu serveur par variante si l’ingestion l’exige. Ne pas déclarer le flux approuvé sans contrôle Google.
- Données du catalogue : faire confirmer les kits et les options d’expédition fournisseur (notamment « Ships From ») pour le marché français. Disponible dans Shopify ne garantit pas une livraison à toute adresse.
- Identité légale, conditions de vente, livraison, retours, garantie : informations toujours attendues, non inventées.
- GA4 / Ads / Meta / Search Console : identifiants et accès toujours attendus.
- `purchase` : uniquement après achat confirmé sur Shopify. Choisir une source par destination (intégration native ou pixel checkout_completed), dédupliquer avec l’identifiant de transaction stable ; si Pixel + CAPI, partager l’event_id. Respecter le consentement et transmettre montant/devise/lignes de la commande réelle. Ne jamais utiliser un clic checkout, une page storefront ou un simple retour navigateur comme preuve d’achat. Vérifier les intégrations Admin existantes avant activation. Une commande en mode test autorisée et l’observation dans les outils Google/Meta sont requises pour lever ce blocage.

Référence Merchant Center : https://support.google.com/merchants/answer/4752265?hl=fr . Les prix, la disponibilité et la variante doivent correspondre à la page de destination et au checkout.

## Livraison

Branche de travail : astra-launch-ready. Aucun merge main, aucun DNS, aucune commande réelle. En cas d’échec du push : bundle Git et archive dist/public conservés dans outputs, suffixe 20260910.
