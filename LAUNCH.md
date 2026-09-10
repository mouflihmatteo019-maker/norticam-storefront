# NORTICAM — préparation du lancement

## Construire et vérifier

Node 20.19+ (24 recommandé), pnpm 11. Installer avec `pnpm install --frozen-lockfile`.
Installer Chromium avec `pnpm exec playwright install chromium`, ou définir `BROWSER_CHANNEL=chrome` pour utiliser Chrome installé.
Copier les paramètres publics souhaités depuis `.env.example`. Aucun secret Admin ou Storefront privé ne doit être préfixé par VITE.

- `pnpm check` : types.
- `pnpm test` : recommandations, valeurs commerciales, erreurs Shopify, consentement.
- `pnpm build` : compilation et pré-rendu de l’interface réelle, à partir de lectures Shopify vérifiées. Échoue si le catalogue ne peut pas être vérifié.
- `pnpm start` : serveur local avec vraies réponses 404.
- `TEST_URL=http://localhost:3000 pnpm test:browser` : tests de parcours (syntaxe des variables à adapter à PowerShell).
- `node scripts/launch-audit.mjs` : audit des pages générées, liens, schémas, erreur API et passage au checkout sans commande.

## Source de vérité

Catalogue, variantes (pagination incluse), prix et disponibilité : Storefront API Shopify 2026-07, marché FR.
Les textes éditoriaux existants restent dans store-data.ts. Les valeurs commerciales de cette ancienne extraction ne sont pas utilisées pour autoriser les achats.
Panier : Cart API. Seul l’identifiant Shopify est conservé localement ; totaux, lignes et checkoutUrl sont relus sur Shopify.
La disponibilité n’est pas une réservation. La validation finale appartient au checkout.
Pas d’avis, de classement de ventes, de remises ou de garanties ajoutés sans preuve.

## SEO et Search Console

Les anciennes URL commerciales utiles sont conservées. 404 dédiée, canonical vers norticam.com, données Product/Offer, Organization, BreadcrumbList et Article.
Le sitemap est généré depuis les routes effectivement pré-rendues. Les pages d’information incomplètes sont noindex et exclues.
VITE_GOOGLE_SITE_VERIFICATION permet la validation d’une propriété URL-prefix. Pour une propriété Domaine, le propriétaire doit valider le DNS dans Search Console.
Après déploiement approuvé : soumettre https://norticam.com/sitemap.xml, inspecter accueil, collection et produit avec le test d’URL en direct, puis contrôler l’indexation. Aucun classement ni délai d’indexation ne peut être garanti.
Sur Hostinger, copier uniquement dist/public et inclure .htaccess. Conserver la configuration du domaine checkout.norticam.com qui répond actuellement au checkout Shopify. Aucun DNS n’a été modifié.
Refaire un build lors des changements de catalogue pour actualiser aussi les offres dans le HTML initial.

## Tracking à connecter

Variables publiques : GA4, Google Ads et Meta Pixel. Aucun identifiant de compte n’a été fourni.
Les scripts marketing ne sont pas chargés sans consentement. Les événements view_item, add_to_cart et begin_checkout utilisent les identifiants numériques de variantes, la devise et les montants issus de Shopify. Vérifier que le flux Meta/Merchant Center utilise les mêmes identifiants avant activation du remarketing.
L’événement purchase doit être mesuré sur Shopify après checkout_completed ou via l’intégration native appropriée ; il n’est jamais déduit d’un clic vers le checkout.
Avant activation, inventorier les pixels et canaux existants dans Shopify pour éviter de doubler les événements. Vérifier aussi l’attribution inter-domaines et la transmission du consentement entre storefront et checkout.
Préférer une seule source d’achat par destination (canal Google/Meta natif OU pixel personnalisé). Ne pas installer les deux pour le même événement sans stratégie de déduplication.
Meta CAPI nécessite un dispositif serveur et des identifiants de compte ; aucun secret CAPI ne doit aller dans ce frontend statique. Ce raccordement et la validation purchase restent bloqués par les accès/configurations externes.

Documentation : https://shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed et https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/gtm-tutorial .

## À obtenir avant toute mise en production

- Identité de l’entreprise, SIRET/immatriculation et mentions légales validées.
- Conditions de vente, livraison (zones, frais, délais), retours, garantie et contact client validés. Lors de l’inspection, Shopify publiait uniquement une politique de confidentialité, avec le contact mouflihmatteo019@gmail.com.
- Validation du contenu exact des kits et caractéristiques conditionnelles (« selon variante »). Aucun média de démonstration vidéo n’était exposé dans les produits Shopify inspectés ; aucun n’a été inventé.
- Accès Search Console et comptes analytics pour activation et test.
- Commande de test autorisée en mode test Shopify pour vérifier paiement, confirmation, stock et purchase. Le passage au checkout a été testé, sans achat.
- Accord explicite de mise en production. La branche ne doit pas être fusionnée/déployée automatiquement avant cet accord.

## Références de présentation

Navigation par besoin et information produit structurée étudiées sur BlackboxMyCar (https://www.blackboxmycar.com/) et REDTIGER (https://redtigercam.com/). Aucun avis, chiffre de ventes, média ou engagement commercial de ces marques n’a été repris.
