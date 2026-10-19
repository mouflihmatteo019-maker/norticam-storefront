# Préparation du lancement Google — thème Shopify natif

Mise à jour locale : 19 octobre 2026. Ce guide décrit le parcours à valider ; il ne confirme ni la configuration actuelle des comptes, ni la réception des événements, ni l'éligibilité publicitaire de NORTICAM. Une compilation ou un test local réussi ne vaut pas validation du lancement.

## Architecture à utiliser

Le parcours principal est le **thème Shopify natif**, avec Shopify Customer Events et les pixels d'application, notamment le canal **Google & YouTube**. Les propriétés, destinations et conversions effectivement connectées restent à vérifier dans les comptes. Google documente cette intégration et son contrôle des doublons : [configurer la balise Google sur Shopify](https://support.google.com/analytics/answer/12183125?hl=en).

Dans le code local, [analytics.ts](../client/src/lib/analytics.ts) quitte ses fonctions de configuration, de page et de commerce lorsque `themeRuntime()` est actif : il ne crée alors ni script Google maison, ni `dataLayer`, ni deuxième événement de commerce. [theme-analytics.ts](../client/src/lib/theme-analytics.ts) publie seulement une liste autorisée d'interactions `norticam:*`, si Shopify Customer Privacy autorise l'analytics. Ce bridge n'envoie jamais `purchase` et ne conserve ni ne rejoue les interactions observées avant cette autorisation.

La publication d'un événement dans Shopify ne prouve pas sa réception par GA4 ou Google Ads. Les interactions personnalisées nécessitent leur propre abonnement et mapping de destination, à contrôler séparément : [tracking du parcours natif](native-funnel-tracking.md).

## Identifiants historiques à revalider

Ces repères proviennent du contexte antérieur et ne constituent pas une observation actuelle des comptes. Relever en lecture seule le propriétaire, le compte, la propriété, le flux et les destinations réellement connectés avant toute modification.

| Repère | Valeur historique | Contrôle attendu |
| --- | --- | --- |
| Propriété GA4 | `557281257` | Propriété appartenant à NORTICAM et flux du bon domaine |
| ID de mesure GA4 | `G-2HGGT89K46` | Flux web effectivement relié au canal Google & YouTube |
| Compte Google Ads | `515-896-4041` | Bon compte client et bonnes actions de conversion ; ce numéro n'est pas un ID de balise `AW-...` |
| Merchant Center | `5855424999` | Bon compte, domaine et source de produits ; état actuel du compte à vérifier |

## Propriétaire de chaque événement de commerce

Le tableau décrit le mapping à contrôler, pas des événements déjà reçus. Pour le thème natif, Shopify émet les événements standard et le pixel Google & YouTube assure leur mapping vers les destinations configurées. [Référence officielle des événements Shopify dans les balises Google](https://developers.google.com/tag-platform/gtagjs/reference/shopify-event-parameters).

| Événement Google | Source Shopify | Preuve à rechercher |
| --- | --- | --- |
| `view_item` | `product_viewed` | Une vraie fiche produit visitée, avec le bon produit et la bonne variante |
| `add_to_cart` | `product_added_to_cart` | Ajout réellement réussi, avec la quantité ajoutée et le prix Shopify |
| `begin_checkout` | `checkout_started` | Début réel du checkout Shopify, pas seulement un clic sur son bouton |
| `purchase` | `checkout_completed` | Commande finalisée dans Shopify et événement reçu avec son `transaction_id`, sa devise et sa valeur |

Ne pas ajouter un second émetteur React, GTM, pixel personnalisé ou webhook pour ces événements sans revoir l'architecture et la déduplication. Un clic checkout, une ouverture de panier, un formulaire envoyé ou une page chargée ne doivent jamais fabriquer un achat. Rapprocher l'événement d'achat de la commande Shopify et de son statut de paiement ; ne pas présenter une commande en attente comme un paiement encaissé.

Pour chaque événement reçu, comparer les identifiants produit/variante, quantités, prix, remises, `value` et `currency` aux données Shopify. Documenter le traitement des taxes et de la livraison : la valeur commerce envoyée par l'application peut différer du total payé. Aucun prix, identifiant ou montant de remplacement ne doit être inventé.

### Achat et déduplication

- Retenir **une seule source d'achat comptée pour l'optimisation Ads** : conversion Google Ads directe via l'application, ou import de l'achat GA4. Si l'autre source reste visible pour comparaison, vérifier qu'elle n'est pas également utilisée dans les objectifs d'enchères. Les ajouts panier et débuts checkout ne doivent pas devenir des achats ni les objectifs principaux d'une campagne visant les ventes par défaut.
- Vérifier un `transaction_id` non vide, stable pour une même commande, distinct pour deux commandes et dépourvu de données personnelles. Un rechargement ou une nouvelle livraison du même événement doit conserver cet identifiant ; ne pas générer un nouvel ID aléatoire à chaque envoi.
- Vérifier les anciennes balises et actions de conversion avant toute suppression ou désactivation. Un même identifiant ne déduplique pas deux actions Ads distinctes. Google décrit la déduplication au sein d'une même action et l'envoi natif des identifiants par Shopify : [identifiants de transaction Google Ads](https://support.google.com/google-ads/answer/6386790?hl=en). Contrôler aussi le comportement GA4 : [validation du commerce électronique](https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce).

## Validation du consentement en France

Tester le domaine et le thème concernés depuis une session correspondant à la France, sur mobile et ordinateur. Repartir d'une session propre pour chaque scénario et consigner la date, l'URL, le thème, les choix, les signaux Shopify, les événements et les destinations. Ne pas utiliser le bouton de consentement forcé du Pixel Helper pour valider un refus réel.

Les pixels ont leurs propres finalités et permissions : le résultat du bridge `norticam:*` ne prouve pas le comportement des pixels Google. Contrôler les paramètres Customer Privacy et chaque pixel concerné, ainsi que les mises à jour après changement de choix. [Confidentialité et consentement des pixels Shopify](https://shopify.dev/docs/api/web-pixels-api/pixel-privacy).

| Scénario | Contrôles attendus |
| --- | --- |
| Avant tout choix, puis refus global | Aucun `norticam:*` du bridge ; analytics et marketing non accordés dans les signaux applicables ; contrôler les requêtes, cookies et comportements réels des destinations |
| Analytics accepté, marketing refusé | Bridge autorisé seulement si Shopify autorise l'analytics ; aucun signal marketing accordé artificiellement ; vérifier le comportement GA4 et Ads selon les permissions réelles du pixel |
| Marketing accepté, analytics refusé, si ce choix est proposé | Aucun `norticam:*` du bridge ; ne pas convertir l'accord marketing en accord analytics ; contrôler séparément les destinations |
| Acceptation des finalités proposées | Contrôler la mise à jour des signaux et la réception des événements attendus ; vérifier qu'une interaction ne crée pas deux événements identiques |
| Révocation après acceptation | Le choix est enregistré et pris en compte sans imposer une nouvelle session ; les nouvelles interactions du bridge sont bloquées lorsque l'analytics n'est plus autorisé ; contrôler aussi les pixels et le comportement après rechargement |

Le bridge NORTICAM ne rejoue pas ses interactions antérieures au consentement. Ne pas étendre cette conclusion aux mécanismes des pixels d'application sans les observer. L'absence d'événement dans DebugView après refus ne suffit pas à prouver l'absence de collecte : des contrôles de confidentialité peuvent masquer les événements dans cet outil. D'éventuelles requêtes sans cookie doivent être examinées avec leurs signaux de consentement, pas assimilées automatiquement à une acceptation. [Limites de DebugView liées au consentement](https://support.google.com/analytics/answer/7201382?hl=en).

## Preuves de réception avant de déclarer le tracking validé

1. Relever en lecture seule, dans Shopify **Paramètres > Événements clients** et Google & YouTube, le pixel, ses permissions, les destinations et les événements configurés. Inventorier les anciennes balises éventuelles.
2. Utiliser le **Shopify Pixel Helper** pour vérifier que le pixel concerné reçoit les événements et ne signale pas d'erreur. Un indicateur vert valide son callback ; il ne prouve pas à lui seul la réception par Google. [Tester un pixel d'application Shopify](https://help.shopify.com/en/manual/promoting-marketing/pixels/app-pixels).
3. Sur une session analytics autorisée avec le mode debug adapté, confirmer `view_item`, `add_to_cart` et `begin_checkout` dans la **bonne propriété GA4, dans DebugView**, avec leurs paramètres. Si le mode debug n'est pas disponible, conserver ce point comme « À vérifier » jusqu'à disposer d'une preuve de réception ; ne pas ajouter une balise de commerce en double pour le faire apparaître.
4. Dans Google Ads, vérifier la destination, l'action, sa source, ses diagnostics et son rôle dans les objectifs. Une balise détectée ou un événement GA4 visible ne prouve pas une conversion Ads attribuée. Conserver séparément les preuves de réception technique et d'attribution.
5. La validation de `purchase`, du rapprochement de commande et de la déduplication reste **À vérifier tant qu'un test de commande n'a pas été explicitement autorisé par le propriétaire**. Préparer d'abord le mode de paiement de test, le montant, les notifications et les éventuels effets sur stock/traitement. Ne soumettre aucune commande, aucun paiement, ni changement de mode de paiement sur la seule base de ce guide.
6. Après ce test autorisé, conserver la preuve de réception GA4/Ads appropriée et vérifier qu'une revisite de la confirmation ne compte pas un deuxième achat. Conserver le même `transaction_id` pour la même commande. [Méthode Google de validation des événements commerce](https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce).

Un test technique ne démontre pas à lui seul l'attribution d'un clic publicitaire réel. Ne créer ni clic publicitaire payant ni dépense pour compléter cette preuve sans autorisation.

## Conditions avant tout trafic payant

Tous les points non observés restent « À vérifier », avec une preuve datée et un responsable. La documentation technique ne peut pas les valider à la place du propriétaire.

- Identité légale et coordonnées réelles de l'entreprise confirmées, puis cohérentes sur le site, les politiques et les comptes. Aucun nom d'entreprise, numéro d'immatriculation, adresse ou justificatif ne doit être inventé.
- Capacité réelle à livrer chaque SKU/variante proposé en France : référence fournisseur vérifiée, disponibilité, coût, délai de préparation et de livraison, service après-vente et retours. Les promesses affichées doivent correspondre à ces éléments, y compris si la livraison est annoncée gratuite.
- Fiches, panier, checkout et politiques cohérents sur les prix, la devise, les frais, les disponibilités, la livraison, les retours et remboursements. Parcours mobile fonctionnel et contact réellement utilisable. Ces points restent à vérifier sur le site servi aux visiteurs.
- Réception des événements, consentement et absence de double comptage validés selon les étapes précédentes ; tout point achat non testé reste explicitement ouvert avant une campagne optimisée sur les achats.
- Pour **Shopping ou Performance Max avec catalogue** : bon compte Merchant Center, domaine vérifié/revendiqué, source de données correcte, France et EUR adaptés au marché, variantes pertinentes, état du compte et approbation/éligibilité des produits ciblés vérifiés. Contrôler les incohérences de prix/disponibilité entre flux, page, données structurées et checkout ainsi que les paramètres de livraison/retour. [Exigences des pages produit Merchant Center](https://support.google.com/merchants/answer/4752265?hl=en), [exigences du checkout](https://support.google.com/merchants/answer/9158778?hl=en).

La correction locale de ce guide n'autorise **aucune publication, liaison de compte, vérification d'identité, demande de réexamen Merchant Center, modification de facturation, création/activation de campagne ou dépense**. Préparer les éléments contrôlables et obtenir l'autorisation du propriétaire immédiatement avant l'action externe concernée.

## Ancien storefront React/Hostinger — hors du parcours natif

Les variables `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID`, `VITE_GOOGLE_ADS_ADD_TO_CART_LABEL`, `VITE_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL` et `VITE_META_PIXEL_ID` concernent uniquement le chemin React autonome où `themeRuntime()` est inactif. Elles ne configurent pas les pixels du thème Shopify natif. Leur présence dans un build ne prouve pas la réception des événements.

Si ce storefront autonome est remis en service ultérieurement, réauditer son consentement, son déploiement, sa mesure commerce et son passage vers le checkout Shopify avant d'appliquer une configuration `VITE_*`. Ne pas recopier cette configuration dans le thème natif. `VITE_CONTACT_FORM_ENDPOINT` concerne le formulaire de cette version autonome, pas la configuration Google ni le formulaire de contact Shopify natif.
