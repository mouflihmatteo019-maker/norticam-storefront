# Préparation Google Ads et Merchant Center

Le storefront transmet les événements `page_view`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart` et `begin_checkout` après consentement. Les identifiants produit, prix, quantité et devise viennent du panier Shopify, jamais de valeurs inventées.

## Variables Hostinger à renseigner avant le lancement

| Variable | Valeur attendue |
| --- | --- |
| `VITE_GA4_ID` | ID de mesure GA4 : `G-...` |
| `VITE_GOOGLE_ADS_ID` | ID Google Ads : `AW-...` |
| `VITE_GOOGLE_ADS_ADD_TO_CART_LABEL` | Libellé de conversion direct, seulement si GA4 n'est pas importé dans Ads |
| `VITE_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL` | Libellé de conversion direct, seulement si GA4 n'est pas importé dans Ads |
| `VITE_META_PIXEL_ID` | ID Meta Pixel, si Meta est utilisé |
| `VITE_CONTACT_FORM_ENDPOINT` | Endpoint HTTPS qui transmet réellement le formulaire à `contact@norticam.com` |

Après ajout ou modification d'une variable `VITE_*`, redéployer le projet Hostinger : Vite les injecte lors du build.

## Conversion achat : action propriétaire requise

`purchase` ne doit pas être déclenché à partir du clic vers le checkout. Configurez l'événement depuis Shopify après paiement, via le canal Google & YouTube ou un webhook Shopify vérifié côté serveur. Utilisez ensuite soit l'import GA4 vers Google Ads, soit une conversion Google Ads directe — jamais les deux pour un même achat, afin d'éviter les doublons.

## Merchant Center

1. Dans Shopify, installez/configurez le canal **Google & YouTube** et connectez le compte Merchant Center de NORTICAM.
2. Vérifiez le pays France, l'Euro, les produits approuvés et les variantes publiées.
3. Renseignez dans Merchant Center/Shopify la livraison gratuite en France et la politique de retour réelle.
4. Publiez les pages légales avec l'identité de l'entreprise, l'adresse et les conditions de retour avant l'envoi final à Merchant Center.
5. Lancez une commande test puis vérifiez DebugView GA4 et les diagnostics Merchant Center.

Les pages produit utilisent déjà les données Shopify de prix et disponibilité et n'émettent pas de faux avis ou d'`AggregateRating`.
