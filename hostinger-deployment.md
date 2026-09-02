# Mise en ligne NORTICAM sur Hostinger

Le package de déploiement `norticam-hostinger-norticam-com.zip` contient les fichiers statiques directement exploitables par Hostinger. Il ne contient pas de base de données : le catalogue est synchronisé au moment du build et le paiement final reste assuré par Shopify.

## Fichiers à envoyer

Décompressez le package à la racine de **`public_html`**. Les éléments suivants doivent apparaître directement dans ce dossier, sans sous-dossier intermédiaire :

| Élément | Rôle |
|---|---|
| `index.html` | Accueil NORTICAM |
| `assets/` | Scripts et styles compilés |
| `produits/`, `conseils/` et catégories | Pages HTML pré-rendues pour les moteurs de recherche |
| `sitemap.xml` et `robots.txt` | Découverte et consignes d’indexation |
| `.htaccess` | Redirection de `www.norticam.com` vers `norticam.com` et en-têtes de sécurité |

Hostinger indique que les fichiers d’un site doivent être placés directement dans `public_html` et que File Manager permet de téléverser puis d’extraire une archive à cet emplacement.[1]

## Séquence de mise en ligne

Dans hPanel, rattachez `norticam.com` à l’hébergement puis installez le certificat SSL. Activez ensuite l’option **Force HTTPS** dans la gestion SSL du site ; Hostinger documente cette option dans son aide dédiée.[2] Téléversez le ZIP dans **File Manager → public_html**, extrayez-le et vérifiez qu’aucun dossier parent supplémentaire ne contient les fichiers.

> Si vous utilisez plutôt un déploiement GitHub avec un pré-réglage **Express**, sélectionnez `pnpm`, Node 22.x, la branche `main` et renseignez **`dist/index.js`** comme fichier d’entrée après le build. Le champ `server.js` provoquerait un échec, car ce fichier n’existe pas dans le dépôt.

Le domaine canonique retenu est **https://norticam.com**. La configuration livrée redirige `www.norticam.com` vers cette adresse ; ne créez pas une règle inverse dans hPanel, afin d’éviter une boucle ou deux versions indexables.

## Contrôles juste après mise en ligne

Ouvrez l’accueil, une catégorie, une fiche produit et un guide, puis vérifiez le panier et le bouton de paiement Shopify. Contrôlez également `https://norticam.com/robots.txt` et `https://norticam.com/sitemap.xml`, puis ajoutez la propriété dans Google Search Console et soumettez le sitemap.

## Références

[1] [Hostinger — How to upload your website](https://www.hostinger.com/tutorials/how-to-upload-your-website/)

[2] [Hostinger — How to enable or disable HTTPS](https://www.hostinger.com/support/1583201-how-to-enable-or-disable-https-for-your-website-at-hostinger/)
