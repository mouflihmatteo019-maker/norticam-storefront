/**
 * Catalogue issu de Shopify le 2026-09-02T18:42:41.936Z.
 * Design reference: NORTICAM storefront — catalogue réel synchronisé depuis Shopify.
 */

export type VariantOption = { name: string; value: string };
export type ProductVariant = { id: string; numericId: string; title: string; availableForSale: boolean; inventoryQuantity: number; price: number; options: VariantOption[]; image: string | null };
export type Product = { id: string; handle: string; title: string; shortTitle: string; vendor: string; productType: string; type: "Dashcam" | "Accessoire"; price: number; available: boolean; image: string | null; imageAlt: string; badge: string; description: string; story: string; details: string[]; variants: ProductVariant[]; shopifyUrl: string };

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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Caméra casque moto 4K — Fodsports FX60C. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565188063581",
        "numericId": "65565188063581",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 6,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam voiture discrète 2K — 70mai M310 Plus. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565188555101",
        "numericId": "65565188555101",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 403,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam voiture mini 2K — KAWA MINI3. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565189570909",
        "numericId": "65565189570909",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 32,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam voiture compacte HDR — 70mai A210. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565191668061",
        "numericId": "65565191668061",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 128,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam avant arrière — DDPAI N1 Dual. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565189964125",
        "numericId": "65565189964125",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 36,
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
    "title": "Dashcam 2K voiture — DDPAI MINI Pro",
    "shortTitle": "DDPAI MINI Pro",
    "vendor": "DDPAI",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 89.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/QcmRyVVtplSIpaDV.webp?v=1787313689",
    "imageAlt": "Dashcam 2K voiture — DDPAI MINI Pro",
    "badge": "Dashcam voiture",
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam 2K voiture — DDPAI MINI Pro. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565190029661",
        "numericId": "65565190029661",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 4,
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
    "title": "Dashcam rétroviseur sans fil 4K — WOLFBOX G930",
    "shortTitle": "WOLFBOX G930",
    "vendor": "WOLFBOX",
    "productType": "Dashcam voiture",
    "type": "Dashcam",
    "price": 229.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/ZLMINahHGzmrqYqN.webp?v=1787313799",
    "imageAlt": "Dashcam rétroviseur sans fil 4K — WOLFBOX G930",
    "badge": "Dashcam 4K",
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam rétroviseur sans fil 4K — WOLFBOX G930. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565191962973",
        "numericId": "65565191962973",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 66,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam 4K GPS — 70mai A810S. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565193797981",
        "numericId": "65565193797981",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 375,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam voiture vision nocturne 4K — AZDOME M550 Pro. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565192356189",
        "numericId": "65565192356189",
        "title": "M550 Pro (2CH) / China Mainland / 64GB Class 10",
        "availableForSale": true,
        "inventoryQuantity": 79,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 1,
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
        "inventoryQuantity": 42,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 67,
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
        "inventoryQuantity": 50,
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
        "inventoryQuantity": 27,
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
        "inventoryQuantity": 43,
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
        "inventoryQuantity": 7,
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
        "inventoryQuantity": 9,
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
        "inventoryQuantity": 5,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 13,
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
        "inventoryQuantity": 9,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 19,
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
        "inventoryQuantity": 104,
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
        "inventoryQuantity": 6,
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
        "inventoryQuantity": 99,
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
        "inventoryQuantity": 9,
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
        "inventoryQuantity": 7,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 10,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam voiture 360° 4K — 70mai X800 Omni. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196976477",
        "numericId": "65565196976477",
        "title": "X800-2 Set n UP03 / United Arab Emirates / UHS-I U3 64GB",
        "availableForSale": true,
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 16,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 9,
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
        "inventoryQuantity": 9,
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
        "inventoryQuantity": 1,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
        "inventoryQuantity": 0,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam 4K avant arrière — DDPAI N5 Dual. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196517725",
        "numericId": "65565196517725",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 5,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto avant arrière — Kocam DVR 1080p. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196714333",
        "numericId": "65565196714333",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 1,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto double caméra — JIUYIN 1080p. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565196845405",
        "numericId": "65565196845405",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 3,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto casque — FreedConn R1 Plus. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201138013",
        "numericId": "65565201138013",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 29,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto sans fil — FreedConn R1 Pro. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201269085",
        "numericId": "65565201269085",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 115,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto 4K — Jansite 8,1 pouces. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201596765",
        "numericId": "65565201596765",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 36,
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
    "title": "Dashcam moto étanche — VSYS D6WL/D6RL",
    "shortTitle": "VSYS D6WL/D6RL",
    "vendor": "VSYS",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 249.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sad3e94a3dbeb473dbb646c4f96adc189m.webp?v=1786629748",
    "imageAlt": "Dashcam moto étanche — VSYS D6WL/D6RL",
    "badge": "Dashcam moto",
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto étanche — VSYS D6WL/D6RL. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201695069",
        "numericId": "65565201695069",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 12,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto 2K — FreedConn Black Box. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565201957213",
        "numericId": "65565201957213",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 13,
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
    "title": "Dashcam moto 360° — MOMAN H4C",
    "shortTitle": "MOMAN H4C",
    "vendor": "MOMAN",
    "productType": "Dashcam moto",
    "type": "Dashcam",
    "price": 159.9,
    "available": true,
    "image": "https://cdn.shopify.com/s/files/1/1101/9753/9165/files/Sb78c1c85b22e4c208e2f2623005742d71.webp?v=1786629749",
    "imageAlt": "Dashcam moto 360° — MOMAN H4C",
    "badge": "Dashcam moto",
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto 360° — MOMAN H4C. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65565202055517",
        "numericId": "65565202055517",
        "title": "Default Title",
        "availableForSale": true,
        "inventoryQuantity": 253,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam Wi-Fi 5 GHz 4K – DDPAI Z50 Pro. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564205917",
        "numericId": "65572564205917",
        "title": "Kit avant + arrière",
        "availableForSale": true,
        "inventoryQuantity": 6,
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
    "description": "Dashcam moto sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam moto CarPlay 6,86 pouces – JMCQ DVR. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564304221",
        "numericId": "65572564304221",
        "title": "Écran 6,86 pouces avec DVR",
        "availableForSale": true,
        "inventoryQuantity": 3,
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
    "description": "Dashcam voiture sélectionnée par NORTICAM. Consultez les options et variantes disponibles avant achat.",
    "story": "Découvrez Dashcam 3K voiture avant arrière – 70mai A510. Les informations, options et disponibilités affichées proviennent du catalogue Shopify de la boutique.",
    "details": [
      "Produit du catalogue NORTICAM",
      "Options selon la variante",
      "Compatibilité à vérifier avant achat"
    ],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/65572564894045",
        "numericId": "65572564894045",
        "title": "Kit avant + arrière",
        "availableForSale": true,
        "inventoryQuantity": 144,
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
