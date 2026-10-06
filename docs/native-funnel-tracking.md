# Tracking des interactions NORTICAM dans le thème natif

État : instrumentation préparée et testée localement. Les événements autorisés sont publiés uniquement si l’API Shopify analytics est disponible et si Shopify Customer Privacy autorise le traitement analytics. Aucune observation antérieure au consentement n’est conservée ou rejouée. Une erreur de mesure ne doit pas interrompre la navigation ou le formulaire.

## Événements personnalisés préparés

| Nom publié | Déclenchement | Données autorisées |
| --- | --- | --- |
| `norticam:quiz_started` | Première réponse au quiz | Nombre de questions |
| `norticam:quiz_step_completed` | Réponse à une étape | Index d’étape et clé de question, jamais la réponse |
| `norticam:quiz_completed` | Résultat calculé après chargement valide du catalogue | Nombre de recommandations, y compris zéro |
| `norticam:contact_email_opened` | Clic mailto dans la zone Contact native | Source `contact_page`, pas l’adresse mail ni le contenu |
| `norticam:contact_form_submit` | Événement submit du formulaire contact Shopify natif | Source `contact_page`, aucun champ du client |
| `norticam:cart_expired` | Retrait du panier à expiration selon la logique existante | Aucune donnée personnelle |

`contact_form_submit` décrit une **tentative de soumission**, pas une confirmation de réception du mail. La validation du serveur, reCAPTCHA ou une erreur réseau peuvent encore empêcher la réception. Aucun faux événement de réussite ou de conversion commerciale n’est généré.

Les listeners Contact sont attachés à la seule zone native via une référence React et un effet avec cleanup. Ils identifient uniquement le marqueur Shopify `form_type=contact` et le préfixe `mailto:` d’un lien, sans lire les champs, sans `preventDefault`, sans modifier les handlers Shopify et sans double handler React de soumission. Le formulaire React alternatif conserve son propre fonctionnement lorsqu’aucun formulaire Liquid n’est fourni.

## Ce qui reste à valider dans les comptes

Publier un événement `norticam:*` dans Shopify **ne prouve pas** qu’il est transmis ou affiché dans GA4, Google Ads ou le dashboard Shopify. Un pixel/abonnement au nom exact et son mapping de destination doivent être configurés dans les comptes, puis contrôlés avec l’outil de test pixels et DebugView sur une session autorisée. Aucun pixel tiers ni compte n’a été ajouté par cette modification.

Les événements de commerce natifs (`product_viewed`, `product_added_to_cart`, `checkout_started`, `checkout_completed`) restent la responsabilité Shopify/app pixels. Aucun deuxième `view_item`, `add_to_cart`, `begin_checkout` ou `purchase` n’est envoyé par ce bridge. `purchase` ne doit jamais être déclenché par un clic checkout. La validation d’un achat, de ses valeurs/devises/identifiants et de sa déduplication nécessite un checkout/test explicitement autorisé.

## Tests et limites

- `theme-analytics.test.ts` : whitelist, consentement, absence de PII, échec API sans interruption, interdiction des événements commerce/purchase.
- `native-contact-tracking.test.ts` : observation submit/mailto, ignore les autres formulaires/éléments, cleanup, pas de prévention de soumission, exception analytics sans interruption.
- `theme-first-render.test.ts` : contrats SSR de catalogue initial prêt et composants synchrones injectés dans le thème ; ne mesure pas un score PageSpeed.

Ces contrôles unitaires n’ont ouvert aucun navigateur et ne constituent pas une validation end-to-end des destinations, de la réception d’un email, du consentement géographique réel ou de l’attribution Ads.
