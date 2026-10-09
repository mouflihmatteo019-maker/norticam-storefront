# Informations pratiques — 9 octobre 2026

## Implémentation

- 22 références actuelles couvertes par trois rubriques dépliantes : Au quotidien, Installation, Votre kit.
- Position : sous les moyens de paiement et le bloc paiement/livraison/retours, dans la colonne d'achat.
- Trois colonnes à partir du breakpoint `sm`, rubriques empilées sur petit écran ; disclosures HTML natives et navigation clavier.
- Données vérifiées séparées de l'interface dans `client/src/lib/product-practical.ts`, liées aux IDs Shopify stables.
- Les références/générations et contenus de kits non confirmés ne reçoivent pas de caractéristiques inventées.
- Le kit suit la variante choisie. Le rendu Liquid initial utilise `product.selected_or_first_available_variant`, pas une ancienne sélection figée.
- Les produits futurs ont un repli prudent. Shopify conserve les prix, variantes, disponibilités et le checkout.

## Changements Shopify / DSers

- X800 et AZDOME M550 Pro : libellés renommés en Configuration, Entrepôt d’expédition, Carte mémoire ; valeurs et IDs conservés.
- Réglages DSers de ces deux références passés de US à FR avec autorisation explicite.
- Observations après changement : X800, stock DSers 0 ; AZDOME M550 Pro, stock DSers 0 et avertissement Supplier SKU out of stock.
- Ce sont les données DSers du fournisseur actuel, pas la preuve d'un inventaire physique chez les futurs fournisseurs privés.
- Certains coûts X800 affichés par DSers dépassent les prix de vente actuels : marge à revalider avant vente.
- Aucun produit ni variante supprimé. Aucun stock, prix, mapping fournisseur ou flux Merchant Center changé.
- À la demande du propriétaire, les références sans stock fournisseur restent présentes et pourront être remappées ensuite.
- Un pays « Ships From » est une origine d'expédition, pas un pays de vente. Pas de suppression fondée sur le nom seul.

## Validation

- TypeScript : PASS.
- 196 tests / 23 fichiers : PASS, dont 11 tests ajoutés pour les rubriques et le rendu Shopify initial des 22 produits, et un test d'identité du moteur JavaScript.
- Compilation du thème : PASS, 56 vues / 22 produits.
- Audit du thème : PASS (structure, routes, canonical, ressources, absence d'avis fictifs dans les données structurées).
- Test DOM du thème : PASS, avec checkout simulé après revalidation du panier ; aucune commande réelle.
- Navigateur local : A510, AZDOME M550 Pro, FreedConn R1 Pro ; ouverture/fermeture, clavier, changement de variante et mise à jour du kit, ajout au panier.
- Le checkout HTTP local est refusé par la sécurité HTTPS existante ; ne pas supprimer cette protection. Le checkout est vérifié par le test DOM simulé, pas par un paiement réel.
- Aucun message d'erreur console observé sur les fiches locales contrôlées.
- La vérification publique a retrouvé un double chargement React préexistant : le script d'entrée versionné par Shopify et les imports non versionnés des chunks créaient deux moteurs/contextes. Correction : petit loader Shopify versionné important un unique runtime nommé par son contenu. Le test DOM utilise maintenant une URL versionnée comme le CDN Shopify.
- Le dernier redimensionnement du navigateur ne reflétait pas la taille demandée : ne pas traiter cette dernière passe comme une validation complète sur appareil mobile réel.
- Vérification publique après synchronisation Shopify : menus dépliants présents, libellés français, changement de configuration et contenu du kit mis à jour ; aucune nouvelle erreur console observée sur une session fraîche.
- Parcours public AZDOME : configuration China Mainland / 128GB Class 10, ajout au panier à 93,17 EUR, ouverture du checkout sécurisé sur norticam.com avec la même variante et le même prix. Aucune donnée client saisie ni commande passée ; article de test retiré et panier vide confirmé.

## Restant avant Merchant Center

Confirmer avec les fournisseurs privés les références exactes, les kits, la livraison en France, les stocks et les coûts ; réconcilier ensuite les stocks Shopify, mapping DSers et flux Merchant. Aucun feu vert Merchant n'est donné par cette modification de contenu.
