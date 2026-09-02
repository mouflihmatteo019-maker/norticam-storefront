# NORTICAM — Storefront déployable

Storefront NORTICAM statique, relié au catalogue Shopify au moment de la synchronisation et préparé pour un déploiement sur **Hostinger** au domaine `https://norticam.com`.

## Déploiement immédiat sur Hostinger

Le fichier prêt à déployer est :

```text
release/norticam-hostinger-norticam-com.zip
```

Dans Hostinger, ouvrez **hPanel → Websites → Dashboard → File Manager**, accédez à `public_html`, téléversez ce ZIP et extrayez-le directement dans ce dossier. Activez ensuite le certificat SSL et l’option **Force HTTPS**.

Le package contient notamment :

| Élément | Utilité |
|---|---|
| Pages HTML pré-rendues | Contenu indexable dès la réponse serveur |
| `sitemap.xml` | URLs canoniques sous `https://norticam.com` |
| `robots.txt` | Déclaration d’indexation et du sitemap |
| `.htaccess` | Redirection `www.norticam.com` vers `norticam.com` |
| `assets/` | Styles et JavaScript du storefront |

## Développement local

```bash
pnpm install
pnpm dev
```

Pour générer une nouvelle version de production :

```bash
pnpm build
cd dist/public
zip -qr ../../release/norticam-hostinger-norticam-com.zip .
```

## Catalogue Shopify

Le catalogue affiché est issu d’une synchronisation Shopify effectuée avant le build. Avant une nouvelle mise en ligne, synchronisez les données produit (prix, images, variantes, stock) puis relancez `pnpm build`. Le panier redirige les clients vers le checkout Shopify natif.

## Contrôles après mise en ligne

Vérifiez :

1. `https://norticam.com/`
2. `https://norticam.com/produits/dashcam-3k-voiture/`
3. `https://norticam.com/sitemap.xml`
4. L’ajout au panier et la redirection vers le checkout Shopify.

Ajoutez ensuite le domaine à Google Search Console, puis soumettez `https://norticam.com/sitemap.xml`.
