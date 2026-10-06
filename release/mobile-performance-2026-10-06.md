# Correctif performance mobile — 6 octobre 2026

Référence PageSpeed : https://pagespeed.web.dev/analysis/https-norticam-com/ddv1je15ql?form_factor=mobile
Mesure initiale : mobile 79, desktop 98, LCP mobile 5,158 s, CLS 0, TBT 105 ms. Aucun gain de score ne peut être déclaré sans nouvelle mesure publique.

## Modifications

- Le hero Shopify de l'accueil reste dans son DOM initial. React monte le menu, le contenu commercial et le pied de page dans trois emplacements indépendants ; l'image principale n'est plus supprimée/recréée au démarrage.
- Les composants, textes, styles et dimensions sont conservés. Comparaison des sources compilées : hero identique (hors attributs de localisation de développement), 55 autres vues identiques après normalisation de ces attributs. CSS inchangé.
- Modules JavaScript séparés par page, importés uniquement pour la page demandée. Le HTML existant reste visible pendant le téléchargement. Les URLs de modules sont relatives au répertoire CDN Shopify, pas à la racine du domaine.
- Aucun retrait des scripts/feuilles Shopify, paiements, consentement ou tracking ; aucune modification DNS/Hostinger, produit, prix, URL ou métadonnée.

## Taille comparée

Avant : JavaScript monolithique 571 825 octets / 162 194 octets gzip.
Après : ensemble des modules requis pour l'accueil 430 316 octets / 128 018 octets gzip, soit environ 21 % de moins en gzip. Ce chiffre ne représente ni le poids total de la page ni un gain Lighthouse garanti. Les pages produit/quiz et autres outils ne sont plus chargés avec l'accueil.

## Validation

- Test DOM Node avec linkedom (dépendance de développement uniquement) exécutant les vrais modules compilés : conservation de l'identité et du HTML du hero, un seul H1, menu, lien Contact, restauration/ouverture du panier, revalidation simulée puis URL checkout correcte. Aucune commande et aucune requête réelle pendant ce test.
- Tests unitaires, types, compilation thème et audit des modules/CDN ; résultats finaux consignés au retour de publication.
- Pas de test visuel navigateur disponible dans cette session. Le test DOM n'émule pas le rendu CSS ni la vitesse d'un téléphone.
- Une nouvelle mesure PageSpeed publique reste nécessaire après publication. Les 8 Ko d'économie potentielle d'image et le CSS de paiement Shopify ne justifient pas de modifier le visuel ni de casser les paiements.

## Retour arrière

Version publique précédente : `ea8d1033dd998d07794e59faca5d6dde69936332`. Révoquer le commit de ce correctif sur la branche du thème en cas de régression confirmée ; ne pas modifier les DNS.
