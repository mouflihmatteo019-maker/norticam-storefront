/**
 * Catalogue issu de Shopify le 2026-09-02T18:42:41.936Z.
 * Design reference: NORTICAM storefront — catalogue réel synchronisé depuis Shopify.
 */

import type { ProductSpecs } from './product-specs';
export type VariantOption = { name: string; value: string };
export type ProductVariant = { id: string; numericId: string; title: string; availableForSale: boolean; inventoryQuantity?: number; price: number; options: VariantOption[]; image: string | null };
export type Product = { id: string; handle: string; title: string; shortTitle: string; vendor: string; productType: string; type: "Dashcam" | "Accessoire"; price: number; available: boolean; image: string | null; imageAlt: string; badge: string; description: string; story: string; details: string[]; specs?: ProductSpecs; variants: ProductVariant[]; shopifyUrl: string };

export const products: Product[] = [
  {
    "id": "gid://shopify/Product/16413273162077",
    "handle": "camera-casque-moto-4k",
    "title": "Caméra casque moto 4K — Fodsports FX60C",
    "shortTitle": "Fodsports FX60C",
    "vendor": "Fodsports",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 229.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S04705043db7b4d40ace86188485145b1F.webp?v=1786629741",
    "imageAlt": "Caméra casque moto 4K — Fodsports FX60C",
    "badge": "Dashcam moto",
    "description": "La Fodsports FX60C filme en 4K stabilisée depuis le casque et assure les communications grâce à son intercom Bluetooth 5.4, utilisable en groupe. Batterie 2 000 mAh rechargeable en USB-C, Wi-Fi, commandes vocales et indice IP65. Carte microSD non incluse : prévoyez une carte compatible fabricant.",
    "story": "La FX60C réunit enregistrement 4K stabilisé et intercom Bluetooth 5.4 sur le casque pour filmer les sorties et communiquer en groupe.",
    "details": [
      "Caméra 4K avec stabilisation et angle large",
      "Intercom Bluetooth 5.4 pour les groupes de motards",
      "Batterie 2 000 mAh, recharge USB-C",
      "Wi-Fi, commandes vocales et indice IP65",
      "Carte microSD non incluse (carte compatible recommandée)"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565188063581",
        "numericId": "65565188063581",
        "title": "Default Title",
        "availableForSale": true,
        "price": 229.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S04705043db7b4d40ace86188485145b1F.webp?v=1786629741"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/camera-casque-moto-4k"
  },
  {
    "id": "gid://shopify/Product/16413273194845",
    "handle": "dashcam-voiture-discrete-2k",
    "title": "Dashcam voiture discrète 2K — 70mai M310 Plus",
    "shortTitle": "70mai M310 Plus",
    "vendor": "70mai",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 99.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/ylfKzOoKClAKTLMg.webp?v=1787648189",
    "imageAlt": "Dashcam voiture discrète 2K — 70mai M310 Plus",
    "badge": "Dashcam voiture",
    "description": "La 70mai M310 Plus filme en 2K 1440p avec un grand angle, dans un boîtier compact à installer sans gêner la visibilité. Wi-Fi intégré, vision nocturne et enregistrement en boucle accompagnent les trajets quotidiens. Le mode parking nécessite le kit de branchement compatible ; sa durée dépend de l’alimentation et des réglages.",
    "story": "Un vrai capteur 2K dans un format compact : la M310 Plus est la porte d'entrée idéale de la marque 70mai, avec l'application maison en bonus pour consulter les séquences.",
    "details": [
      "Vidéo 2K 1440p avec angle de vue large",
      "Wi-Fi intégré et vision nocturne",
      "Enregistrement en boucle",
      "Mode parking avec kit de branchement compatible (vendu séparément) ; durée selon l’énergie disponible et les réglages"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565188555101",
        "numericId": "65565188555101",
        "title": "Default Title",
        "availableForSale": true,
        "price": 99.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S81d5236d5fb646d4b3f2d3443b785463e.webp?v=1786629740"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-voiture-discrete-2k"
  },
  {
    "id": "gid://shopify/Product/16413273260381",
    "handle": "dashcam-voiture-mini-2k",
    "title": "Dashcam voiture mini 2K — KAWA MINI3",
    "shortTitle": "KAWA MINI3",
    "vendor": "KAWA",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 119.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/droZnPYRUkpDixSQ.webp?v=1787648200",
    "imageAlt": "Dashcam voiture mini 2K — KAWA MINI3",
    "badge": "Dashcam voiture",
    "description": "La KAWA MINI3 concentre un enregistrement 2K dans un boîtier mini qui se fond derrière le rétroviseur. Wi-Fi et application pour la consultation, vision nocturne et enregistrement en boucle : l'essentiel est là, sans écran superflu. Choisissez la carte mémoire adaptée à votre usage.",
    "story": "La MINI3 associe un boîtier compact à l’image 2K pour une installation discrète, à préparer selon votre véhicule.",
    "details": [
      "Enregistrement 2K dans un format mini",
      "Wi-Fi avec application compatible",
      "Vision nocturne et enregistrement en boucle",
      "Installation discrète derrière le rétroviseur",
      "Capacité de carte mémoire à choisir parmi les options disponibles"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565189570909",
        "numericId": "65565189570909",
        "title": "Default Title",
        "availableForSale": true,
        "price": 119.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S41fb35eea66f43928bd0ca0ee1e981ebs.webp?v=1786629741"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-voiture-mini-2k"
  },
  {
    "id": "gid://shopify/Product/16413273293149",
    "handle": "dashcam-voiture-compacte-hdr",
    "title": "Dashcam voiture compacte HDR — 70mai A210",
    "shortTitle": "70mai A210",
    "vendor": "70mai",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 149.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/uaIpeFNthEGYizai.webp?v=1787648214",
    "imageAlt": "Dashcam voiture compacte HDR — 70mai A210",
    "badge": "Dashcam voiture",
    "description": "La 70mai A210 enregistre en 1080p HDR dans un format compact. Le traitement HDR aide à gérer les variations de lumière. L’application permet de consulter les enregistrements après le trajet.",
    "story": "La A210 associe un boîtier compact à l’enregistrement 1080p HDR pour conserver le contexte des trajets et consulter les séquences avec l’application.",
    "details": [
      "Vidéo 1080p HDR pour les écarts de luminosité",
      "Boîtier compact pour une installation dans l’habitacle",
      "Application pour consulter les enregistrements"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565191668061",
        "numericId": "65565191668061",
        "title": "Default Title",
        "availableForSale": true,
        "price": 149.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S57eeedb3f9f94f018a674bd9d459176eq.webp?v=1786629742"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-voiture-compacte-hdr"
  },
  {
    "id": "gid://shopify/Product/16413273358685",
    "handle": "dashcam-avant-arriere",
    "title": "Dashcam avant arrière — DDPAI N1 Dual",
    "shortTitle": "DDPAI N1 Dual",
    "vendor": "DDPAI",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 149.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/REajHkhSaPTLUeNn.webp?v=1787648221",
    "imageAlt": "Dashcam avant arrière — DDPAI N1 Dual",
    "badge": "Avant & arrière",
    "description": "La DDPAI N1 Dual couvre l'avant jusqu'en 1296p et l'arrière en 1080p, sans écran ni boîtier volumineux. Sa technologie NightVIS améliore les scènes peu éclairées, et l'application DDPAI centralise consultation et téléchargement. Un double enregistrement sobre, pensé pour les créneaux et les tamponnages.",
    "story": "Sans écran ni fioritures, la N1 Dual consacre le budget aux deux capteurs plutôt qu'à l'affichage. Idéale si vous pilotez tout depuis l'application et que vous voulez documenter l'arrière du véhicule.",
    "details": [
      "Caméra avant jusqu'à 1296p et caméra arrière 1080p",
      "Technologie NightVIS pour les scènes peu éclairées",
      "Consultation et récupération via l'application DDPAI",
      "Format compact, sans écran encombrant",
      "Câble de caméra arrière à acheminer via le hayon avant installation"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565189964125",
        "numericId": "65565189964125",
        "title": "Default Title",
        "availableForSale": true,
        "price": 149.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S5176ee8ef5d84f06bfd362ca81cfd0b67.webp?v=1786629741"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-avant-arriere"
  },
  {
    "id": "gid://shopify/Product/16413273456989",
    "handle": "dashcam-2k-voiture",
    "title": "Dashcam compacte 1296p — DDPAI MINI Pro",
    "shortTitle": "DDPAI MINI Pro",
    "vendor": "DDPAI",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 89.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/QcmRyVVtplSIpaDV.webp?v=1787313689",
    "imageAlt": "Dashcam compacte DDPAI MINI Pro 1296p",
    "badge": "Dashcam voiture",
    "description": "La DDPAI MINI Pro filme l’avant en 2304 × 1296 pixels avec un angle de 140°, dans un format cylindrique compact. Consultez les vidéos par Wi-Fi avec l’application DDPAI. Le mode parking nécessite un câble d’alimentation compatible vendu séparément.",
    "story": "La MINI Pro enregistre la route en 2304 × 1296 pixels dans un format cylindrique compact. Choisissez son emplacement et le passage des câbles sans gêner votre visibilité.",
    "details": [
      "Résolution 2304 × 1296 pixels, champ de vision 140°",
      "Format cylindrique compact pour une pose discrète",
      "Wi-Fi 2,4 GHz et application DDPAI",
      "Vision nocturne et enregistrement en boucle",
      "Mode parking avec alimentation permanente compatible ; durée selon l’énergie disponible"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565190029661",
        "numericId": "65565190029661",
        "title": "Default Title",
        "availableForSale": true,
        "price": 89.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Safc9678e963849308ce35ae3aa75857e5.webp?v=1786629742"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-2k-voiture"
  },
  {
    "id": "gid://shopify/Product/16413273489757",
    "handle": "dashcam-retroviseur-sans-fil-wolfbox-g930",
    "title": "Dashcam rétroviseur 4K Wi-Fi — WOLFBOX G930",
    "shortTitle": "WOLFBOX G930",
    "vendor": "WOLFBOX",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 229.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/ZLMINahHGzmrqYqN.webp?v=1787313799",
    "imageAlt": "Dashcam rétroviseur 4K Wi-Fi — WOLFBOX G930",
    "badge": "Dashcam 4K",
    "description": "La WOLFBOX G930 réunit une caméra avant 4K et un écran rétroviseur tactile de 10 pouces. Le Wi-Fi permet de consulter les vidéos sur smartphone, et la surveillance en stationnement dépend de l'alimentation choisie.",
    "story": "Le G930 associe rétroviseur numérique et enregistrement vidéo sur un seul écran. Préparez le montage pour conserver une visibilité adaptée à votre véhicule.",
    "details": [
      "Écran rétroviseur tactile 10 pouces en remplacement du rétroviseur",
      "Caméra avant 4K",
      "Wi-Fi intégré pour consulter les vidéos sur smartphone",
      "Fonction de surveillance en stationnement selon l'alimentation"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565191962973",
        "numericId": "65565191962973",
        "title": "Default Title",
        "availableForSale": true,
        "price": 229.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S9cad38cc54a24910babac1f3d273d13ed.webp?v=1786629743"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-retroviseur-sans-fil-wolfbox-g930"
  },
  {
    "id": "gid://shopify/Product/16413273522525",
    "handle": "dashcam-4k",
    "title": "Dashcam 4K GPS — 70mai A810S",
    "shortTitle": "70mai A810S",
    "vendor": "70mai",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 229.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/chNLNseGICelMaOl.webp?v=1787648232",
    "imageAlt": "Dashcam 4K GPS — 70mai A810S",
    "badge": "Dashcam 4K",
    "description": "La 70mai A810S mise sur un capteur Sony IMX678 en 4K avec HDR pour des images détaillées de jour comme de nuit. Selon la configuration, elle ajoute Wi-Fi 6, GPS, commandes vocales et fonctions d'aide à la conduite ; la caméra arrière et le 4G restent des options. Une base premium à compléter selon vos besoins.",
    "story": "L’A810S associe un capteur Sony IMX678 à l’enregistrement 4K HDR. Choisissez la configuration avec ou sans caméra arrière selon la couverture recherchée.",
    "details": [
      "Vidéo 4K avec capteur Sony IMX678",
      "HDR et enregistrement nocturne optimisé",
      "Wi-Fi 6 et GPS selon la configuration",
      "Commandes vocales et fonctions d'aide à la conduite",
      "Caméra arrière, 4G et kits de stationnement selon accessoires"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565193797981",
        "numericId": "65565193797981",
        "title": "Default Title",
        "availableForSale": true,
        "price": 229.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Saaa5e881649d4f08b1fcffdfe64c67efA.webp?v=1786629745"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-4k"
  },
  {
    "id": "gid://shopify/Product/16413273555293",
    "handle": "dashcam-voiture-vision-nocturne",
    "title": "Dashcam voiture vision nocturne 4K — AZDOME M550 Pro",
    "shortTitle": "AZDOME M550 Pro",
    "vendor": "AZDOME",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 84.19,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/tgKwAzbCtetADCqL.webp?v=1787731575",
    "imageAlt": "AZDOME M550 Pro dashcam 4K, vue principale",
    "badge": "Dashcam 4K",
    "description": "La AZDOME M550 Pro enregistre l'avant en 4K et monte jusqu'à trois canaux selon la variante : route, arrière et habitacle, ce dernier éclairé par six LED infrarouges pour filmer même dans le noir complet. Wi-Fi 5,8 GHz, GPS, détection de choc et mode parking selon l'équipement complètent une fiche tournée vers les trajets de nuit.",
    "story": "La M550 Pro propose plusieurs angles d’enregistrement selon la configuration sélectionnée. Les LED infrarouges sont dédiées à l’habitacle peu éclairé ; elles n’éclairent pas la route.",
    "details": [
      "Caméra avant 4K avec Wi-Fi 5,8 GHz",
      "Jusqu'à trois canaux selon la variante (avant, arrière, habitacle)",
      "Six LED infrarouges pour l'enregistrement en habitacle peu éclairé",
      "GPS, détection de choc et surveillance de stationnement",
      "Versions 2CH et 3CH : vérifiez la variante avant commande"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565192356189",
        "numericId": "65565192356189",
        "title": "M550 Pro (2CH) / China Mainland / 64GB Class 10",
        "availableForSale": true,
        "price": 121.25,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192388957",
        "numericId": "65565192388957",
        "title": "M550 Pro (3CH) n HW / Saudi Arabia / 128GB Class 10",
        "availableForSale": true,
        "price": 185.77,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192421725",
        "numericId": "65565192421725",
        "title": "M550 Pro (3CH) n HW / Saudi Arabia / 256GB Class 10",
        "availableForSale": true,
        "price": 132.63,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192454493",
        "numericId": "65565192454493",
        "title": "M550 Pro (2CH) / China Mainland / 128GB Class 10",
        "availableForSale": true,
        "price": 93.17,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192487261",
        "numericId": "65565192487261",
        "title": "M550 Pro (2CH) / China Mainland / 256GB Class 10",
        "availableForSale": true,
        "price": 170.85,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192520029",
        "numericId": "65565192520029",
        "title": "M550 Pro (3CH) / Saudi Arabia / 64GB Class 10",
        "availableForSale": true,
        "price": 94.67,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192552797",
        "numericId": "65565192552797",
        "title": "M550 Pro (2CH) / Saudi Arabia / 64GB Class 10",
        "availableForSale": true,
        "price": 84.19,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192585565",
        "numericId": "65565192585565",
        "title": "M550 Pro (2CH) n HW / China Mainland / 64GB Class 10",
        "availableForSale": true,
        "price": 93.62,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192618333",
        "numericId": "65565192618333",
        "title": "M550 Pro (2CH) n HW / China Mainland / 128GB Class 10",
        "availableForSale": true,
        "price": 106.62,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192651101",
        "numericId": "65565192651101",
        "title": "M550 Pro (3CH) / Saudi Arabia / 128GB Class 10",
        "availableForSale": true,
        "price": 104.77,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192683869",
        "numericId": "65565192683869",
        "title": "M550 Pro (3CH) / Saudi Arabia / 256GB Class 10",
        "availableForSale": true,
        "price": 119.37,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192716637",
        "numericId": "65565192716637",
        "title": "M550 Pro (3CH) / China Mainland / 128GB Class 10",
        "availableForSale": true,
        "price": 102.08,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192749405",
        "numericId": "65565192749405",
        "title": "M550 Pro (3CH) / China Mainland / 256GB Class 10",
        "availableForSale": true,
        "price": 182.84,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192782173",
        "numericId": "65565192782173",
        "title": "M550 Pro (2CH) / Saudi Arabia / 128GB Class 10",
        "availableForSale": true,
        "price": 95.96,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192814941",
        "numericId": "65565192814941",
        "title": "M550 Pro (2CH) / Saudi Arabia / 256GB Class 10",
        "availableForSale": true,
        "price": 109.23,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH)"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S722f0a37f0ca46588eb639e7ae030f68C.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192847709",
        "numericId": "65565192847709",
        "title": "M550 Pro (3CH) n HW / China Mainland / 256GB Class 10",
        "availableForSale": true,
        "price": 205.05,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192880477",
        "numericId": "65565192880477",
        "title": "M550 Pro (3CH) n HW / Saudi Arabia / 64GB Class 10",
        "availableForSale": true,
        "price": 105.2,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192913245",
        "numericId": "65565192913245",
        "title": "M550 Pro (3CH) n HW / China Mainland / 64GB Class 10",
        "availableForSale": true,
        "price": 101.83,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192946013",
        "numericId": "65565192946013",
        "title": "M550 Pro (3CH) n HW / China Mainland / 128GB Class 10",
        "availableForSale": true,
        "price": 114.82,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Seb5c7f5a5ab14bd294104275c25c5c103.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565192978781",
        "numericId": "65565192978781",
        "title": "M550 Pro (3CH) / China Mainland / 64GB Class 10",
        "availableForSale": true,
        "price": 150.2,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (3CH)"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S987c05169dc44ab6a896167049c06f13x.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565193011549",
        "numericId": "65565193011549",
        "title": "M550 Pro (2CH) n HW / Saudi Arabia / 128GB Class 10",
        "availableForSale": true,
        "price": 109.22,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "128GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565193044317",
        "numericId": "65565193044317",
        "title": "M550 Pro (2CH) n HW / Saudi Arabia / 256GB Class 10",
        "availableForSale": true,
        "price": 124.83,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565193077085",
        "numericId": "65565193077085",
        "title": "M550 Pro (2CH) n HW / China Mainland / 256GB Class 10",
        "availableForSale": true,
        "price": 192.1,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "256GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      },
      {
        "id": "gid://shopify/ProductVariant/65565193109853",
        "numericId": "65565193109853",
        "title": "M550 Pro (2CH) n HW / Saudi Arabia / 64GB Class 10",
        "availableForSale": true,
        "price": 96.65,
        "options": [
          {
            "name": "Color Name",
            "value": "M550 Pro (2CH) n HW"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "64GB Class 10"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S4ea3b77472d7482b85e4081a838d4988s.webp?v=1786629744"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-voiture-vision-nocturne"
  },
  {
    "id": "gid://shopify/Product/16413273620829",
    "handle": "dashcam-voiture-360-4k",
    "title": "Dashcam voiture 360° 4K — 70mai X800 Omni",
    "shortTitle": "70mai X800 Omni",
    "vendor": "70mai",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 292.96,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/QJVMRZIfVOYFijzV.webp?v=1787731850",
    "imageAlt": "70mai X800 Omni dashcam 4K, vue principale",
    "badge": "Dashcam 4K",
    "description": "La 70mai X800 Omni embarque une caméra 4K rotative à 360° qui suit la scène autour du véhicule, avec GPS, Wi-Fi et supercondensateur pour les climats difficiles. Selon la configuration, elle s'associe à un canal HDR supplémentaire et à une surveillance de stationnement (kit requis). De nombreuses variantes existent : choisissez celle qui correspond à votre véhicule et à votre carte mémoire.",
    "story": "La X800 Omni permet d’orienter sa caméra motorisée autour du véhicule. Cette rotation filme une direction à la fois et ne correspond pas à une capture panoramique simultanée.",
    "details": [
      "Caméra 4K orientable à 360°, une direction filmée à la fois",
      "Configuration double canal HDR selon la variante",
      "GPS et Wi-Fi intégrés, supercondensateur pour les écarts de température",
      "Surveillance de stationnement avec kit d'alimentation compatible"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196976477",
        "numericId": "65565196976477",
        "title": "X800-2 Set n UP03 / United Arab Emirates / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197009245",
        "numericId": "65565197009245",
        "title": "X800-2 Set n UP03 / United Arab Emirates / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 710.03,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197042013",
        "numericId": "65565197042013",
        "title": "X800-2 Set n UP03 / United Arab Emirates / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197074781",
        "numericId": "65565197074781",
        "title": "X800-2 Set n UP03 / United Arab Emirates / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 890.37,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197107549",
        "numericId": "65565197107549",
        "title": "X800-2 Set n UP03 / China Mainland / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 374.11,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197140317",
        "numericId": "65565197140317",
        "title": "X800-2 Set n UP03 / China Mainland / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 835.75,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197173085",
        "numericId": "65565197173085",
        "title": "X800-2 Set n UP03 / China Mainland / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 959.72,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197205853",
        "numericId": "65565197205853",
        "title": "X800-2 Set n UP03 / United Arab Emirates / No TF Card",
        "availableForSale": true,
        "price": 653.68,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197238621",
        "numericId": "65565197238621",
        "title": "X800-2 Set n UP03 / Poland / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 890.37,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197271389",
        "numericId": "65565197271389",
        "title": "X800-2 Set n UP03 / Russian Federation / No TF Card",
        "availableForSale": true,
        "price": 653.68,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197304157",
        "numericId": "65565197304157",
        "title": "X800-2 Set n UP03 / Russian Federation / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197336925",
        "numericId": "65565197336925",
        "title": "X800-2 Set n UP03 / Russian Federation / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 710.03,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197369693",
        "numericId": "65565197369693",
        "title": "X800-2 Set n UP03 / Poland / No TF Card",
        "availableForSale": true,
        "price": 653.68,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197402461",
        "numericId": "65565197402461",
        "title": "X800-2 Set n UP03 / Poland / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197435229",
        "numericId": "65565197435229",
        "title": "X800-2 Set n UP03 / Poland / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 710.03,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197467997",
        "numericId": "65565197467997",
        "title": "X800-2 Set n UP03 / Poland / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197500765",
        "numericId": "65565197500765",
        "title": "X800-2 Set n UP03 / Russian Federation / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800-2 Set n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sf548cef1df94447384653278de5b7908n.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197533533",
        "numericId": "65565197533533",
        "title": "X800 Front Cam / Russian Federation / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 563.51,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197566301",
        "numericId": "65565197566301",
        "title": "X800 Front Cam / Russian Federation / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 642.41,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197599069",
        "numericId": "65565197599069",
        "title": "X800 Front Cam / Russian Federation / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197631837",
        "numericId": "65565197631837",
        "title": "X800 Front Cam / Saudi Arabia / No TF Card",
        "availableForSale": true,
        "price": 507.16,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197664605",
        "numericId": "65565197664605",
        "title": "X800 Front Cam / Poland / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 642.41,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197697373",
        "numericId": "65565197697373",
        "title": "X800 Front Cam / Poland / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197730141",
        "numericId": "65565197730141",
        "title": "X800 Front Cam / Russian Federation / No TF Card",
        "availableForSale": true,
        "price": 507.16,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197762909",
        "numericId": "65565197762909",
        "title": "X800 Front Cam / Russian Federation / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 529.7,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197795677",
        "numericId": "65565197795677",
        "title": "X800 Front n UP03 / China Mainland / No TF Card",
        "availableForSale": true,
        "price": 292.96,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197828445",
        "numericId": "65565197828445",
        "title": "X800 Front n UP03 / China Mainland / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 303.78,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197861213",
        "numericId": "65565197861213",
        "title": "X800 Front n UP03 / China Mainland / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 320.01,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197893981",
        "numericId": "65565197893981",
        "title": "X800 Front n UP03 / China Mainland / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 745.58,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197926749",
        "numericId": "65565197926749",
        "title": "X800 Front Cam / Saudi Arabia / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 529.7,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197959517",
        "numericId": "65565197959517",
        "title": "X800 Front Cam / Saudi Arabia / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 563.51,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565197992285",
        "numericId": "65565197992285",
        "title": "X800 Front Cam / Saudi Arabia / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 642.41,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198025053",
        "numericId": "65565198025053",
        "title": "X800 Front Cam / Saudi Arabia / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 766.39,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front Cam"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S37abe9a9fbe94f7fa8e144a63e28375ci.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198057821",
        "numericId": "65565198057821",
        "title": "X800 Front n UP03 / United Arab Emirates / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198090589",
        "numericId": "65565198090589",
        "title": "X800 Front n UP03 / United Arab Emirates / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 800.2,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198123357",
        "numericId": "65565198123357",
        "title": "X800 Front n UP03 / Poland / No TF Card",
        "availableForSale": true,
        "price": 540.97,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198156125",
        "numericId": "65565198156125",
        "title": "X800 Front n UP03 / Poland / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 563.51,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198188893",
        "numericId": "65565198188893",
        "title": "X800 Front n UP03 / China Mainland / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 869.56,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "China Mainland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198221661",
        "numericId": "65565198221661",
        "title": "X800 Front n UP03 / United Arab Emirates / No TF Card",
        "availableForSale": true,
        "price": 540.97,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198254429",
        "numericId": "65565198254429",
        "title": "X800 Front n UP03 / United Arab Emirates / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 563.51,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198287197",
        "numericId": "65565198287197",
        "title": "X800 Front n UP03 / United Arab Emirates / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 597.33,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "United Arab Emirates"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198319965",
        "numericId": "65565198319965",
        "title": "X800 Front n UP03 / Russian Federation / UHS-I U3 64GB",
        "availableForSale": true,
        "price": 563.51,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 64GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198352733",
        "numericId": "65565198352733",
        "title": "X800 Front n UP03 / Russian Federation / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 597.33,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198385501",
        "numericId": "65565198385501",
        "title": "X800 Front n UP03 / Russian Federation / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198418269",
        "numericId": "65565198418269",
        "title": "X800 Front n UP03 / Russian Federation / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 800.2,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198451037",
        "numericId": "65565198451037",
        "title": "X800 Front n UP03 / Poland / UHS-I U3 128GB",
        "availableForSale": true,
        "price": 597.33,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 128GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198483805",
        "numericId": "65565198483805",
        "title": "X800 Front n UP03 / Poland / UHS-I U3 256GB",
        "availableForSale": true,
        "price": 676.22,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 256GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198516573",
        "numericId": "65565198516573",
        "title": "X800 Front n UP03 / Poland / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 800.2,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Poland"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198549341",
        "numericId": "65565198549341",
        "title": "X800 Front n UP03 / Russian Federation / No TF Card",
        "availableForSale": true,
        "price": 540.97,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Russian Federation"
          },
          {
            "name": "Sd Card Memory",
            "value": "No TF Card"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      },
      {
        "id": "gid://shopify/ProductVariant/65565198582109",
        "numericId": "65565198582109",
        "title": "X800 Front n UP03 / Saudi Arabia / UHS-I U3 512GB",
        "availableForSale": true,
        "price": 800.2,
        "options": [
          {
            "name": "Color Name",
            "value": "X800 Front n UP03"
          },
          {
            "name": "Ships From",
            "value": "Saudi Arabia"
          },
          {
            "name": "Sd Card Memory",
            "value": "UHS-I U3 512GB"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8f1f0433ffc3467ca68a3df2c3c27a4a7.webp?v=1786629746"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-voiture-360-4k"
  },
  {
    "id": "gid://shopify/Product/16413273653597",
    "handle": "dashcam-4k-avant-arriere",
    "title": "Dashcam 4K avant arrière — DDPAI N5 Dual",
    "shortTitle": "DDPAI N5 Dual",
    "vendor": "DDPAI",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 249.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S1b2628ef594d41d0b467e36dc360719a7.webp?v=1786629744",
    "imageAlt": "Dashcam 4K avant arrière — DDPAI N5 Dual",
    "badge": "Dashcam 4K",
    "description": "La DDPAI N5 Dual place une caméra 4K à l'avant et une seconde à l'arrière pour conserver deux points de vue du trajet. HDR, NightVIS, Wi-Fi 6, GPS et commandes vocales complètent cette configuration, avec une surveillance de stationnement nécessitant une alimentation compatible. Sa durée dépend de l’énergie disponible et des réglages. Vérifiez le contenu du kit sélectionné.",
    "story": "La N5 Dual associe une image avant 4K au contexte de la caméra arrière. Vérifiez l’alimentation compatible si vous souhaitez utiliser le mode parking.",
    "details": [
      "Double enregistrement avant/arrière avec caméra avant 4K",
      "HDR et technologie NightVIS pour les scènes difficiles",
      "Wi-Fi 6, GPS et commandes vocales",
      "Surveillance de stationnement avec alimentation compatible ; durée selon l’énergie disponible et les réglages",
      "Vérifiez les accessoires de la configuration sélectionnée"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196517725",
        "numericId": "65565196517725",
        "title": "Default Title",
        "availableForSale": true,
        "price": 249.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sb7984f67d7d7432caa37de1c5a82bc71H.webp?v=1786629744"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-4k-avant-arriere"
  },
  {
    "id": "gid://shopify/Product/16413273686365",
    "handle": "dashcam-moto-avant-arriere",
    "title": "Dashcam moto avant arrière — Kocam DVR 1080p",
    "shortTitle": "Kocam DVR 1080p",
    "vendor": "Kocam",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 189.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S9e6472d7a1bc4a3fa3abdc8b298ad6b8w.webp?v=1786629745",
    "imageAlt": "Dashcam moto avant arrière — Kocam DVR 1080p",
    "badge": "Dashcam moto",
    "description": "La Kocam DVR enregistre simultanément l'avant et l'arrière de la moto en Full HD 1080p, depuis un boîtier compact. L’enregistrement en boucle permet de conserver les séquences du trajet. Protégez le boîtier et les connexions conformément aux consignes de montage.",
    "story": "La Kocam DVR couvre les deux directions avec deux vraies caméras dédiées, un atout pour documenter les situations où un seul objectif ne suffit pas, notamment dans la circulation urbaine dense.",
    "details": [
      "Deux caméras Full HD 1080p avant et arrière",
      "Boîtier DVR compact à installer sur la moto",
      "Enregistrement en boucle pour conserver les séquences importantes"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196714333",
        "numericId": "65565196714333",
        "title": "Default Title",
        "availableForSale": true,
        "price": 189.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S9895766ba160432a85ec1c8e0d46f18dT.webp?v=1786629745"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-avant-arriere"
  },
  {
    "id": "gid://shopify/Product/16413273719133",
    "handle": "dashcam-moto-double-camera",
    "title": "Dashcam moto double caméra — JIUYIN 1080p",
    "shortTitle": "JIUYIN 1080p",
    "vendor": "JIUYIN",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 149.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sfc0aefc488c54d8fb105557e569fff9dE.webp?v=1786629745",
    "imageAlt": "Dashcam moto double caméra — JIUYIN 1080p",
    "badge": "Dashcam moto",
    "description": "La JIUYIN installe deux caméras 1080p sur la moto — avant et arrière — reliées à un DVR compact logé sous la selle. Wi-Fi pour récupérer les vidéos et enregistrement en boucle. Un système fixe discret, sans caméra sur le casque.",
    "story": "Pour équiper une moto de vidéosurveillance sans rien porter sur le casque, la JIUYIN couvre les deux directions à prix maîtrisé. Le DVR se fixe à l'abri et se pilote depuis l'application.",
    "details": [
      "Deux caméras 1080p pour une couverture avant/arrière",
      "DVR compact installé à l'abri sur la moto",
      "Wi-Fi pour récupérer les enregistrements",
      "Enregistrement en boucle"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196845405",
        "numericId": "65565196845405",
        "title": "Default Title",
        "availableForSale": true,
        "price": 149.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8b45c50a63b64484b6db426a15053febu.webp?v=1786629746"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-double-camera"
  },
  {
    "id": "gid://shopify/Product/16413273751901",
    "handle": "dashcam-moto-casque",
    "title": "Dashcam moto casque — FreedConn R1 Plus",
    "shortTitle": "FreedConn R1 Plus",
    "vendor": "FreedConn",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 179.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/HDuhBwEodAbSyzDg.webp?v=1787997886",
    "imageAlt": "FreedConn R1 Plus caméra d’intercom moto, vue principale",
    "badge": "Dashcam moto",
    "description": "La FreedConn R1 Plus intègre une caméra 1080p directement dans un intercom Bluetooth de casque : filmer, appeler et écouter la navigation sans ajouter de boîtier. Réduction de bruit pour des échanges clairs en roulant, batterie intégrée. Vérifiez la compatibilité avec votre type de casque avant commande.",
    "story": "La R1 Plus réunit intercom et caméra dans un appareil porté sur le casque. Suivez les consignes du fabricant du casque pour le choix du support et son emplacement.",
    "details": [
      "Caméra 1080p intégrée à l'intercom de casque",
      "Bluetooth pour appels, navigation et communication",
      "Réduction de bruit pour des échanges plus clairs",
      "Batterie intégrée pour les sorties moto"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201138013",
        "numericId": "65565201138013",
        "title": "Default Title",
        "availableForSale": true,
        "price": 179.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S44a5ec2d72f346d9bd593d4024fec7acP.webp?v=1786629746"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-casque"
  },
  {
    "id": "gid://shopify/Product/16413273817437",
    "handle": "dashcam-moto-sans-fil",
    "title": "Dashcam moto sans fil — FreedConn R1 Pro",
    "shortTitle": "FreedConn R1 Pro",
    "vendor": "FreedConn",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 219.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/IsBbMyenYxNtepNt.webp?v=1787998265",
    "imageAlt": "FreedConn R1 Pro caméra embarquée moto, vue principale",
    "badge": "Dashcam moto",
    "description": "La FreedConn R1 Pro se fixe sur le casque et réunit caméra embarquée, intercom Bluetooth et connexion Wi-Fi : appels, communication entre motards et enregistrement des sorties, sans câbler le véhicule.",
    "story": "Zéro câble sur la moto, tout sur le casque : la R1 Pro est faite pour ceux qui changent souvent de machine ou roulent sur plusieurs motos, sans installation permanente.",
    "details": [
      "Caméra embarquée sur intercom de casque",
      "Wi-Fi et Bluetooth pour la connexion au smartphone",
      "Appels et communication entre motards",
      "Conception prévue pour une utilisation moto, sans câblage du véhicule"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201269085",
        "numericId": "65565201269085",
        "title": "Default Title",
        "availableForSale": true,
        "price": 219.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S8ca232758f394ce6bd2087d81d3f294d6.webp?v=1786629746"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-sans-fil"
  },
  {
    "id": "gid://shopify/Product/16413273882973",
    "handle": "dashcam-moto-4k",
    "title": "Dashcam moto 4K — Jansite 8,1 pouces",
    "shortTitle": "Jansite 8,1 pouces",
    "vendor": "Jansite",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 229.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/UvoqDgvJJpJgrAbO.webp?v=1787998441",
    "imageAlt": "Jansite 8,1 pouces dashcam moto, vue principale",
    "badge": "Dashcam moto",
    "description": "Le Jansite 8,1 pouces associe un écran panoramique de moto, CarPlay et Android Auto sans fil, GPS et caméra avant 4K. Boîtier IP67. Préparez le montage pour préserver la visibilité et l’accès aux commandes.",
    "story": "Le Jansite réunit navigation sur écran 8,1 pouces et enregistrement 4K. Choisissez un emplacement qui préserve la visibilité et l’accès aux commandes de la moto.",
    "details": [
      "Écran large 8,1 pouces pour la navigation et les informations",
      "Caméra avant 4K",
      "CarPlay et Android Auto sans fil",
      "GPS et protection IP67"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201596765",
        "numericId": "65565201596765",
        "title": "Default Title",
        "availableForSale": true,
        "price": 229.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sd92227c615f1472d98b90821faca03c0C.webp?v=1786629747"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-4k"
  },
  {
    "id": "gid://shopify/Product/16413273981277",
    "handle": "dashcam-moto-etanche",
    "title": "Dashcam moto double caméra — VSYS",
    "shortTitle": "VSYS",
    "vendor": "VSYS",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 249.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sad3e94a3dbeb473dbb646c4f96adc189m.webp?v=1786629748",
    "imageAlt": "Dashcam moto double caméra — VSYS",
    "badge": "Dashcam moto",
    "description": "La dashcam moto VSYS utilise deux caméras 1080p pour enregistrer l’avant et l’arrière du trajet. Vision nocturne, Wi-Fi et application pour consulter les séquences. Protégez le boîtier et les connexions conformément aux consignes de montage.",
    "story": "La VSYS propose une installation fixe sur la moto pour conserver deux points de vue du parcours sans porter la caméra sur le casque.",
    "details": [
      "Double caméra 1080p avant et arrière",
      "Installation fixe sur la moto",
      "Vision nocturne pour les trajets en faible luminosité",
      "Wi-Fi et application pour accéder aux enregistrements"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201695069",
        "numericId": "65565201695069",
        "title": "Default Title",
        "availableForSale": true,
        "price": 249.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Scdbb1cc07ecd40c9b953ce4505bdc37f5.webp?v=1786629748"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-etanche"
  },
  {
    "id": "gid://shopify/Product/16413274014045",
    "handle": "dashcam-moto-2k",
    "title": "Dashcam moto 2K — FreedConn Black Box",
    "shortTitle": "FreedConn Black Box",
    "vendor": "FreedConn",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 169.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sbab4b3cd419b4b95b9a39239e8c572b2G.webp?v=1786629748",
    "imageAlt": "Dashcam moto 2K — FreedConn Black Box",
    "badge": "Dashcam moto",
    "description": "La FreedConn Black Box installe sur la moto un boîtier discret qui enregistre en 2K 1440p, avec Wi-Fi et application pour récupérer les vidéos. Prévoyez un emplacement protégé pour le boîtier et les connexions, conformément à la notice.",
    "story": "La Black Box reste fixée sur la moto. Son boîtier compact permet de préparer une installation discrète, avec un passage de câbles adapté au véhicule.",
    "details": [
      "Vidéo 2K 1440p depuis un boîtier fixe discret",
      "Wi-Fi et application mobile pour récupérer les vidéos"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201957213",
        "numericId": "65565201957213",
        "title": "Default Title",
        "availableForSale": true,
        "price": 169.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S948e142e61ac435caab8f1f3be0f5700P.webp?v=1786629748"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-2k"
  },
  {
    "id": "gid://shopify/Product/16413274079581",
    "handle": "dashcam-moto-360",
    "title": "Caméra casque moto 1080p orientable — MOMAN H4C",
    "shortTitle": "MOMAN H4C",
    "vendor": "MOMAN",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 159.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sb78c1c85b22e4c208e2f2623005742d71.webp?v=1786629749",
    "imageAlt": "Caméra de casque moto orientable MOMAN H4C",
    "badge": "Dashcam moto",
    "description": "La MOMAN H4C associe une caméra de casque 1080p orientable et l’audio Bluetooth du téléphone. Sa rotation permet de régler le cadrage, pas de filmer tous les angles simultanément. Elle ne propose pas d’intercom entre motards.",
    "story": "La caméra suit le pilote plutôt que la moto. Réglez son orientation avant de partir, puis retrouvez votre point de vue en vidéo et les indications audio du téléphone.",
    "details": [
      "Caméra 1080p grand angle à rotation 360°",
      "Audio Bluetooth pour appels et guidage du téléphone, sans intercom entre motards",
      "Carte microSD 32 Go indiquée selon la variante",
      "Protection IPX6 annoncée par le fabricant, sans immersion"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565202055517",
        "numericId": "65565202055517",
        "title": "Default Title",
        "availableForSale": true,
        "price": 159.9,
        "options": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sc9c862162b64475496425ff7e138d3536.webp?v=1786629749"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-360"
  },
  {
    "id": "gid://shopify/Product/16415887360349",
    "handle": "dashcam-wifi-5ghz",
    "title": "Dashcam Wi-Fi 5 GHz 4K – DDPAI Z50 Pro",
    "shortTitle": "DDPAI Z50 Pro",
    "vendor": "DDPAI",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 169.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/IDRfUExiQDMQtvNh.webp?v=1787648241",
    "imageAlt": "Dashcam Wi-Fi 5 GHz 4K – DDPAI Z50 Pro",
    "badge": "Dashcam 4K",
    "description": "La DDPAI Z50 Pro enregistre l'avant en 4K et l'arrière en 1080p, avec un Wi-Fi 5 GHz / Wi-Fi 6 dont le transfert est annoncé jusqu'à 13 Mo/s vers l'application, selon les conditions. NightVIS 2.0 traite les scènes peu éclairées, sans garantir la lisibilité de tous les détails. Le mode parking nécessite le kit de branchement intelligent (non inclus) ; sa durée dépend de l’alimentation et des réglages. Carte microSD U3 requise, jusqu'à 512 Go.",
    "story": "La Z50 Pro vise les conducteurs pressés : récupérer une séquence sur smartphone en quelques secondes, sans sortir la carte SD. Le supercondensateur et le double enregistrement 4K/1080p complètent un profil tourné vers la fiabilité.",
    "details": [
      "Double enregistrement : 4K avant + 1080p arrière",
      "Wi-Fi 5 GHz / Wi-Fi 6 : transfert annoncé jusqu'à 13 Mo/s",
      "NightVIS 2.0 avec traitement AI-ISP pour la faible luminosité",
      "Supercondensateur : meilleure tenue en températures élevées",
      "GPS intégré, ADAS et écran IPS 3 pouces (objectif F/1.8)",
      "Surveillance de stationnement avec kit intelligent (vendu séparément) ; durée selon l’énergie disponible et les réglages",
      "Cartes microSD jusqu'à 512 Go (U3 recommandée pour la 4K)"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564205917",
        "numericId": "65572564205917",
        "title": "Kit avant + arrière",
        "availableForSale": true,
        "price": 169.9,
        "options": [
          {
            "name": "Configuration",
            "value": "Kit avant + arrière"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sc68934e565b84681bbc814337a52d2feT.webp?v=1786698121"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-wifi-5ghz"
  },
  {
    "id": "gid://shopify/Product/16415887393117",
    "handle": "dashcam-moto-carplay-dvr",
    "title": "Dashcam moto CarPlay 6,86 pouces – JMCQ DVR",
    "shortTitle": "JMCQ DVR",
    "vendor": "JMCQ",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 179.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/BTrqKVNIyfRxgHPy.webp?v=1787648251",
    "imageAlt": "Dashcam moto CarPlay 6,86 pouces – JMCQ DVR",
    "badge": "Dashcam moto",
    "description": "Le JMCQ DVR 6,86 pouces associe un écran moto tactile panoramique (1280 × 480, jusqu'à 1 000 nits) à un enregistreur double caméra. CarPlay et Android Auto sans fil, double Bluetooth pour casque et protection IP67/IPX7 : tout ce qu'il faut pour naviguer, appeler et filmer sur deux roues. Le DVR s'utilise hors mode CarPlay ; carte microSD jusqu'à 256 Go requise (non incluse).",
    "story": "Plutôt que d'empiler GPS, intercom et caméra sur le guidon, le JMCQ DVR les réunit dans un écran lisible même en plein soleil. Raccordement impératif via le faisceau ACC fourni — la connexion directe à la batterie est déconseillée par le fournisseur.",
    "details": [
      "Écran IPS tactile 6,86 pouces, 1280 × 480, luminosité annoncée jusqu'à 1 000 nits",
      "Apple CarPlay et Android Auto sans fil",
      "DVR double caméra (avant et arrière) inclus dans cette configuration",
      "Double Bluetooth : smartphone puis casque compatible",
      "Résistance à l'eau annoncée IP67 / IPX7",
      "Faisceau ACC fourni obligatoire, installation par une personne compétente recommandée",
      "Carte microSD jusqu'à 256 Go requise (non incluse)"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564304221",
        "numericId": "65572564304221",
        "title": "Écran 6,86 pouces avec DVR",
        "availableForSale": true,
        "price": 179.9,
        "options": [
          {
            "name": "Configuration",
            "value": "Écran 6,86 pouces avec DVR"
          }
        ],
        "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/S2881cae79dfe47ac9ab2965f8be5dd85E.webp?v=1786698121"
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-moto-carplay-dvr"
  },
  {
    "id": "gid://shopify/Product/16415887425885",
    "handle": "dashcam-3k-voiture",
    "title": "Dashcam 3K voiture avant arrière – 70mai A510",
    "shortTitle": "70mai A510",
    "vendor": "70mai",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 149.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/NFtwDmlhCwPfysOp.webp?v=1787215695",
    "imageAlt": "Dashcam 3K voiture avant arrière – 70mai A510",
    "badge": "Avant & arrière",
    "description": "La 70mai A510 filme l'avant en 3K HDR (2592 × 1944 px) et l'arrière grâce à son kit double caméra. Son capteur Sony IMX675 et son traitement nocturne traitent les scènes peu éclairées ; la lisibilité dépend des conditions. Le GPS, le Wi-Fi et l'application 70mai permettent de consulter les séquences. Le mode parking requiert le kit d'alimentation 70mai, vendu séparément ; sa durée dépend de l’énergie disponible et des réglages. Carte microSD non incluse.",
    "story": "Conçue pour les conducteurs qui veulent plus de détails qu'en 2K sans payer le prix de la 4K, l'A510 trouve un équilibre rare entre qualité d'image, fonctions connectées et budget. Le double enregistrement avant/arrière documente aussi bien la route que les créneaux difficiles.",
    "details": [
      "Caméra avant 3K HDR 2592 × 1944 px, caméra arrière incluse",
      "Capteur Sony IMX675 avec technologie d'amélioration nocturne 70mai",
      "GPS intégré : vitesse et position enregistrées sur la vidéo",
      "Wi-Fi + application 70mai pour consulter et exporter les séquences",
      "Alertes ADAS et protection automatique des séquences sur choc (G-sensor)",
      "Mode parking avec kit d'alimentation 70mai compatible (non inclus) ; durée selon l’énergie disponible et les réglages",
      "Carte microSD non incluse : prévoir une carte compatible selon la notice",
      "Enregistrement en boucle",
      "Fonctionnement annoncé de −20 °C à 70 °C, codec H.265"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564894045",
        "numericId": "65572564894045",
        "title": "Kit avant + arrière",
        "availableForSale": true,
        "price": 149.9,
        "options": [
          {
            "name": "Configuration",
            "value": "Kit avant + arrière"
          }
        ],
        "image": null
      }
    ],
    "shopifyUrl": "https://z4a1f0-p0.myshopify.com/products/dashcam-3k-voiture"
  }
];
const priorityHandles = ["dashcam-3k-voiture","dashcam-avant-arriere","dashcam-4k"];
export const dashcams = products.filter((product) => product.productType.toLowerCase().includes("dashcam")).sort((left, right) => { const leftIndex = priorityHandles.indexOf(left.handle); const rightIndex = priorityHandles.indexOf(right.handle); return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex); });
export const accessories = products.filter((product) => product.productType.toLowerCase().includes("accessoire"));
export const featuredDashcams = priorityHandles.map((handle) => products.find((product) => product.handle === handle)).filter((product): product is Product => Boolean(product));
export const productByHandle = (handle?: string) => products.find((product) => product.handle === handle);
export const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
