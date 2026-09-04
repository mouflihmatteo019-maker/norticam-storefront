import fs from "node:fs";
import path from "node:path";
import { products, euro, productByHandle, type Product } from "../client/src/lib/store-data.ts";

const root = process.cwd();
const output = path.join(root, "dist", "public");
// Le domaine choisi pour NORTICAM est la référence publique du storefront.
// VITE_SITE_URL reste disponible si l’adresse doit être modifiée ultérieurement.
const configuredOrigin = (process.env.VITE_SITE_URL || "https://norticam.com").trim().replace(/\/+$/, "");
const publicOrigin = configuredOrigin;
const siteName = "NORTICAM";

// Date utilisée pour <lastmod> du sitemap et datePublished des guides.
// SITEMAP_LASTMOD permet d’injecter la date réelle de sync Shopify au build.
const buildDate = (process.env.SITEMAP_LASTMOD || new Date().toISOString().slice(0, 10)).slice(0, 10);

// Image Open Graph par défaut (utilisée quand une page n’a pas d’image propre).
// Idéalement : remplacer par une image OG dédiée 1200x630 (logo + tagline).
const DEFAULT_OG_IMAGE = "/manus-storage/norticam-mark_79e2d2ea.png";

// Ces artefacts de prévisualisation ne sont pas nécessaires sur Hostinger.
fs.rmSync(path.join(output, "__manus__"), { recursive: true, force: true });
fs.rmSync(path.join(output, ".gitkeep"), { force: true });

type Page = {
  route: string;
  title: string;
  description: string;
  body: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  image?: string | null;
  /** null = ne pas émettre de canonical (pages d’erreur). */
  canonical?: string | null;
  /** true = émettre un meta robots noindex. */
  noindex?: boolean;
};

type Faq = { q: string; a: string };
type GuideSection = { h2: string; paras: string[] };
type Guide = { slug: string; title: string; description: string; intro: string; sections: GuideSection[]; faq: Faq[] };

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
const canonicalPath = (route: string) => route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`;
const absoluteUrl = (route: string) => publicOrigin ? `${publicOrigin}${canonicalPath(route)}` : undefined;
const absoluteImage = (image: string) => /^https?:\/\//i.test(image) ? image : (publicOrigin ? `${publicOrigin}${image}` : image);
const productRoute = (product: Product) => `/produits/${product.handle}`;

function breadcrumbLd(route: string, label: string) {
  const segments = canonicalPath(route).split("/").filter(Boolean);
  const items: Array<Record<string, unknown>> = [{ "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") }];
  let accumulated = "";
  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const isLast = index === segments.length - 1;
    const name = isLast ? label : segment === "produits" ? "Produits" : segment === "conseils" ? "Conseils" : segment;
    items.push({ "@type": "ListItem", position: index + 2, name, ...(isLast ? {} : { item: absoluteUrl(accumulated) }) });
  });
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
}

function faqLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

function faqSection(faq: Faq[]) {
  return `<section><h2>Questions fréquentes</h2>${faq.map(({ q, a }) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`).join("")}</section>`;
}

function productCard(product: Product) {
  const image = product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy" width="640" height="640">` : "";
  return `<article class="seo-card">${image}<p>${escapeHtml(product.badge)}</p><h2><a href="${productRoute(product)}">${escapeHtml(product.title)}</a></h2><p>${escapeHtml(product.description)}</p><strong>${escapeHtml(euro(product.price))}</strong></article>`;
}

function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image ? [product.image] : undefined,
    description: product.description,
    brand: { "@type": "Brand", name: product.vendor || siteName },
    sku: product.variants[0]?.numericId,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productRoute(product)) || product.shopifyUrl,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

const carDashcams = products.filter((product) => /voiture/i.test(product.productType));
const motorcycleDashcams = products.filter((product) => /moto/i.test(product.productType));

// Mode parking : liste explicite des handles (source : fiches Shopify).
// La regex n’est conservée qu’en secours et signale tout modèle non listé.
const PARKING_HANDLES: string[] = [
  "dashcam-3k-voiture", "dashcam-wifi-5ghz", "dashcam-4k-avant-arriere",
  "dashcam-4k", "dashcam-voiture-compacte-hdr", "dashcam-voiture-discrete-2k",
  "dashcam-2k-voiture", "dashcam-avant-arriere", "dashcam-retroviseur-sans-fil-wolfbox-g930",
];
const parkingRegex = /parking|a510|a810|m550|x800/i;
const parkingDashcams = products.filter((product) => PARKING_HANDLES.includes(product.handle) || parkingRegex.test(`${product.title} ${product.productType}`));
for (const product of parkingDashcams.filter((p) => !PARKING_HANDLES.includes(p.handle))) {
  console.warn(`[mode-parking] "${product.handle}" matché par la regex de secours : ajoutez-le à PARKING_HANDLES.`);
}

const CATEGORY_FAQ: Record<string, Faq[]> = {
  "/dashcam-voiture": [
    { q: "Une dashcam voiture est-elle légale en France ?", a: "Oui, l’usage d’une dashcam est légal en France. En revanche, les enregistrements relèvent du RGPD : ne les diffusez pas publiquement sans flouter les plaques et visages des tiers, et limitez la conservation des vidéos au nécessaire." },
    { q: "Quelle résolution choisir pour une dashcam voiture ?", a: "La 2K (QHD) offre déjà un bon équilibre qualité/taille de fichier pour identifier plaques et situations. La 4K apporte plus de détails, utile si vous roulez beaucoup la nuit ou si vous voulez exploiter des crops d’image." },
    { q: "Faut-il une dashcam avant/arrière ?", a: "La caméra arrière devient pertinente si vous vous garez souvent en bord de rue ou si vous voulez documenter les collisions par l’arrière. Elle demande un câblage plus long, généralement via le hayon." },
  ],
  "/dashcam-moto": [
    { q: "Comment est alimentée une dashcam moto ?", a: "Les systèmes fixes se raccordent à la batterie via un faisceau dédié, souvent avec boîtier de contrôle sur le guidon. Les caméras de casque fonctionnent sur batterie intégrée. Vérifiez la compatibilité électrique avant l’achat." },
    { q: "Une dashcam moto tient-elle à la pluie ?", a: "Les modèles conçus pour la moto affichent un indice de protection (IP65, IP67, IPX7). Vérifiez l’indice exact sur la fiche de la variante choisie avant d’exposer la caméra aux intempéries." },
    { q: "Dashcam moto : où fixer les caméras ?", a: "L’avant se fixe généralement sur le guidon ou la fourche, l’arrière sous la selle ou le porte-bagages. La stabilité et l’angle dégagé priment sur le positionnement esthétique." },
  ],
  "/mode-parking": [
    { q: "Comment fonctionne le mode parking d’une dashcam ?", a: "En mode parking, la dashcam passe en veille et se réveille sur détection de choc ou de mouvement, selon le modèle. Elle nécessite une alimentation permanente, via un kit de protection de batterie ou une batterie dédiée." },
    { q: "Le mode parking use-t-il la batterie de la voiture ?", a: "Un câblage correct avec kit de protection de batterie coupe l’alimentation avant que la batterie ne descende sous un seuil critique. Sans ce kit, une surveillance prolongée peut décharger la batterie." },
    { q: "Quelle autonomie en mode parking ?", a: "Elle dépend du véhicule, de la batterie et du mode de détection. Les modèles à détection de choc consomment très peu ; la détection de mouvement ou le timelapse offrent plus de couverture mais sollicitent davantage la batterie." },
  ],
};

function categoryPage(route: string, label: string, title: string, description: string, selection: Product[]): Page {
  const url = absoluteUrl(route);
  const faq = CATEGORY_FAQ[route];
  return {
    route,
    title,
    description,
    body: `<main class="seo-page"><p class="seo-kicker">${escapeHtml(label)}</p><h1>${escapeHtml(title.split(" | ")[0])}</h1><p class="seo-lead">${escapeHtml(description)}</p><nav aria-label="Catégories"><a href="/boutique">Toute la gamme</a><a href="/dashcam-voiture">Dashcams voiture</a><a href="/dashcam-moto">Dashcams moto</a><a href="/mode-parking">Mode parking</a></nav><section><h2>Modèles disponibles</h2><div class="seo-grid">${selection.map(productCard).join("")}</div></section>${faq ? faqSection(faq) : ""}</main>`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: label,
        url,
        numberOfItems: selection.length,
        itemListElement: selection.map((product, position) => ({ "@type": "ListItem", position: position + 1, url: absoluteUrl(productRoute(product)) || product.shopifyUrl, name: product.title })),
      },
      breadcrumbLd(route, label),
      ...(faq ? [faqLd(faq)] : []),
    ],
  };
}

/* ---------------------------------- Guides ---------------------------------- */

const guides: Guide[] = [
  {
    slug: "quelle-dashcam-voiture-choisir",
    title: "Quelle dashcam voiture choisir ? Les critères qui comptent vraiment",
    description: "Résolution, angle, avant/arrière, mode parking, carte mémoire : les critères essentiels pour choisir une dashcam voiture adaptée à votre usage.",
    intro: "Une dashcam n’est pas un gadget : c’est une assurance documentaire. Mais entre les fiches techniques gonflées et les promesses marketing, difficile de savoir où regarder. Voici les critères qui changent vraiment quelque chose sur la qualité de vos enregistrements.",
    sections: [
      { h2: "Commencez par votre usage, pas par la fiche technique", paras: [
        "Trajets quotidiens en ville, longues autoroutes, stationnement nocturne en rue, voiture partagée entre plusieurs conducteurs : chaque profil ne répond pas aux mêmes priorités. Listez vos trois situations les plus fréquentes avant de comparer quoi que ce soit : elles détermineront la résolution utile, la couverture avant/arrière et la nécessité ou non d’un mode parking.",
        "Une erreur classique consiste à acheter la fiche technique la plus chargée alors que l’usage est simple — ou l’inverse, à sous-équiper un véhicule qui dort régulièrement dehors.",
      ] },
      { h2: "Résolution : 2K, 3K ou 4K ?", paras: [
        "En journée, une bonne dashcam 2K (1440p) capture déjà les plaques d’immatriculation jusqu’à une distance utile, avec des fichiers deux fois moins lourds qu’en 4K. La 3K (comme la 70mai A510) ajoute une marge appréciable sur les bords d’image, là où l’angle grand-angle déforme le plus.",
        "La 4K se justifie principalement pour la nuit et l’autoroute : les capteurs des modèles récents captent davantage de lumière et les détails restent exploitables après zoom. Si vous roulez peu après la tombée du jour, une 2K ou 3K honnête est un meilleur investissement que de la 4K marketing.",
      ] },
      { h2: "L’angle de vue : le bon compromis", paras: [
        "Un angle de 170° couvre largement, mais déforme fortement les bords : une plaque latérale devient illisible. La plage utile se situe entre 120° et 150° — assez large pour embrasser trois voies, assez étroite pour garder des pixels exploitables au centre de l’image, là où se joue la plupart des litiges.",
      ] },
      { h2: "Avant seule ou avant/arrière ?", paras: [
        "La caméra avant couvre la majorité des situations. La caméra arrière devient décisive pour deux cas de figure : les chocs en stationnement (délit de fuite au créneau) et les tamponnages à l’arrêt, où la responsabilité se discute souvent. Elle demande un câblage plus long via le hayon, à prévoir dans l’installation.",
      ] },
      { h2: "Le mode parking, en toute honnêteté", paras: [
        "En mode parking, la dashcam veille et s’éveille sur choc, mouvement ou enregistre en timelapse, selon le modèle. Aucun de ces modes n’est magique : la détection de choc consomme peu mais ne filme pas le moment qui précède l’impact, la détection de mouvement multiplie les faux positifs, le timelapse offre le meilleur compromis preuve/consommation.",
        "Dans tous les cas, une alimentation permanente avec kit de protection de batterie est indispensable pour ne jamais vous retrouver avec une batterie à plat. Vérifiez sur la fiche produit si le kit est inclus ou vendu séparément — c’est presque toujours le second cas.",
      ] },
      { h2: "La carte mémoire : le maillon faible", paras: [
        "Les cartes microSD grand public ne sont pas conçues pour être réécrites en boucle 24 h/24 : elles lâchent en quelques mois, souvent silencieusement. Prévoyez une carte « high endurance » de 128 Go minimum — c’est le poste le moins spectaculaire et le plus rentable de votre installation.",
      ] },
      { h2: "Légale en France, encadrée par le RGPD", paras: [
        "L’usage d’une dashcam est légal en France, y compris sur la voie publique. Les enregistrements relèvent en revanche du RGPD : ne diffusez pas de vidéo où des tiers sont identifiables (plaques, visages) sans les flouter, et limitez leur conservation. Les transmettre à votre assurance ou aux forces de l’ordre en cas de sinistre est parfaitement licite.",
      ] },
      { h2: "Notre sélection par profil", paras: [
        "Première dashcam et budget contenu : la 70mai M310 Plus ou la DDPAI MINI Pro. Meilleur équilibre image/prix avec double caméra : la 70mai A510. Priorité nuit et transferts rapides : la DDPAI Z50 Pro. Couverture maximale à 360° : la 70mai X800 Omni. Tous les modèles sont comparés dans notre boutique.",
      ] },
    ],
    faq: [
      { q: "Quelle dashcam voiture pour un débutant ?", a: "Un modèle 2K compact avec Wi-Fi, comme la 70mai M310 Plus ou la DDPAI MINI Pro : image nette, installation simple, budget maîtrisé. Ajoutez une carte microSD haute endurance dès la commande." },
      { q: "La 4K est-elle indispensable pour lire les plaques ?", a: "Non. Une bonne 2K suffit en journée. La 4K apporte un gain réel la nuit ou sur autoroute, au prix de fichiers plus lourds." },
      { q: "Le mode parking décharge-t-il la batterie ?", a: "Pas avec un kit de protection de batterie correctement installé : l’alimentation est coupée avant que la tension ne descende sous le seuil critique." },
      { q: "Peut-on installer soi-même une dashcam avant/arrière ?", a: "L’avant, oui, en quelques minutes (prise allume-cigare ou allume-cigare durci). L’arrière demande de faire passer un câble jusqu’au hayon : faisable par un bricoleur patient, souvent confié à un professionnel." },
      { q: "Dashcam obligatoire ou conseillée pour les VTC et taxis ?", a: "Conseillée, parfois exigée par les plateformes ou les assurances. Pour ces usages intensifs, privilégiez un modèle 3 canaux avec vision infrarouge de l’habitacle, comme la AZDOME M550 Pro." },
    ],
  },
  {
    slug: "dashcam-avant-arriere-guide",
    title: "Dashcam avant/arrière : pourquoi deux caméras valent mieux qu’une",
    description: "Ce que la caméra arrière change vraiment, comment se passe l’installation et quels modèles avant/arrière choisir selon votre budget.",
    intro: "La majorité des dashcams ne filment que la route devant. Pourtant, une part significatif des sinistres survient à l’arrière du véhicule : tamponnage à l’arrêt, coup de pare-chocs au créneau, délit de fuite de nuit. La configuration avant/arrière répond exactement à ces situations.",
    sections: [
      { h2: "Ce que la caméra arrière change vraiment", paras: [
        "Dans un tamponnage à l’arrêt, l’enjeu est presque toujours la responsabilité — et donc le récit des faits. Une caméra arrière transforme un « il m’a poussé » en preuve horodatée. De même, un choc découvert au retour de courses devient traçable si le mode parking était actif.",
        "À l’inverse, si votre véhicule dort en garage ou en parking surveillé, la caméra arrière apporte moins que ce que son câblage coûte en effort d’installation. C’est un achat d’usage, pas d’ego.",
      ] },
      { h2: "1296p avant, 1080p arrière : suffisant ?", paras: [
        "Oui. L’arrière du véhicule est une zone de proche et de moyenne distance : 1080p y capture très bien plaques et trajectoires. Les modèles comme la DDPAI N1 Dual (1296p/1080p) ou la 70mai A510 (3K HDR avant) montrent qu’il ne faut pas de la 4K des deux côtés pour obtenir une preuve solide.",
      ] },
      { h2: "L’installation : le câble arrière, l’étape qui décourage", paras: [
        "La caméra avant se pose derrière le rétroviseur en quelques minutes. L’arrière exige de faire passer un câble le long du pavillon, des montants et jusqu’au hayon — comptez 45 minutes à 2 heures selon le véhicule, ou confiez-le à un installateur. Avant l’achat, vérifiez que le hayon offre un chemin de câble compatible.",
      ] },
      { h2: "La vision nocturne côté arrière", paras: [
        "La nuit, l’éclairage de plaque et les feux des véhicules suiveurs aident, mais une technologie de traitement d’image comme le NightVIS de DDPAI ou le capteur Sony des 70mai garde l’arrière lisible là où des modèles bas de gamme n’enregistrent qu’un halo.",
      ] },
      { h2: "Quel modèle avant/arrière choisir ?", paras: [
        "Budget maîtrisé : DDPAI N1 Dual, sobre et efficace. Meilleur équilibre : 70mai A510, 3K HDR et caméra arrière incluse dans le kit. Priorité 4K et transferts rapides : DDPAI Z50 Pro. Besoin d’angles morts au créneau : 70mai X800 Omni et sa caméra rotative 360°. Comparez les fiches dans la catégorie dashcams voiture.",
      ] },
    ],
    faq: [
      { q: "La caméra arrière enregistre-t-elle en permanence ?", a: "Oui, sur les kits avant/arrière : les deux canaux enregistrent en boucle simultanément, chacun sur son propre flux." },
      { q: "L’installation arrière est-elle réversible ?", a: "Oui. Le câble se loge dans les passages de portière et de hayon sans perçage ; la caméra arrière se fixe généralement sur la vitre ou sous l’aileron de toit." },
      { q: "Faut-il deux cartes mémoire ?", a: "Non. Un seul enregistreur gère les deux canaux ; une carte microSD de capacité suffisante (128 Go haute endurance minimum) couvre l’ensemble." },
      { q: "Quelle différence avec une dashcam 360° ?", a: "L’avant/arrière utilise deux caméras fixes orientées route et hayon. La 360° utilise une caméra rotative qui balaie les abords du véhicule — plus polyvalente au créneau, moins spécialisée sur la route." },
    ],
  },
  {
    slug: "dashcam-moto-guide",
    title: "Dashcam moto : installer une caméra sur deux roues, le guide",
    description: "Casque ou moto fixe, étanchéité, alimentation, légalité : tout ce qu’il faut vérifier avant d’équiper sa moto d’une dashcam.",
    intro: "Sur deux roues, une caméra n’a pas le même rôle que sur quatre : la moto n’a pas de carrosserie pour absorber, ni de témoin. L’enregistrement devient souvent le seul récit fiable d’un incident. Mais l’équipement moto obéit à des contraintes spécifiques — voici comment les traiter.",
    sections: [
      { h2: "Trois familles de solutions", paras: [
        "Caméra de casque (FreedConn R1 Plus, MOMAN H4C, Fodsports FX60C) : elle suit le pilote, s’alimente sur batterie et se règle à la main. Système fixe double caméra (VSYS D6, JIUYIN, Kocam, FreedConn Black Box) : installé sur la moto, il filme dès le démarrage, avant et arrière. Écran connecté (JMCQ DVR, Jansite) : il ajoute CarPlay, Android Auto et navigation au double enregistrement.",
      ] },
      { h2: "Casque, guidon ou moto fixe ?", paras: [
        "Le casque suit votre regard et fonctionne sur plusieurs motos, mais sa batterie impose des pauses et l’angle dépend du port du casque. La moto fixe filme en continu et se raccorde à la batterie, au prix d’une installation définitive. L’écran connecté réunit navigation et caméras, mais occupe le guidon et demande le faisceau ACC adapté.",
      ] },
      { h2: "Étanchéité et alimentation : les vrais sujets", paras: [
        "Un indice IP65 protège des projections, IP67/IPX7 autorise la pluie soutenue — vérifiez la valeur exacte sur la variante choisie, elle varie parfois au sein d’un même produit. Côté alimentation, les fournisseurs recommandent le faisceau ACC (coupe contact) plutôt qu’un raccordement direct à la batterie ; les caméras de casque fonctionnent sur batterie intégrée rechargeable.",
      ] },
      { h2: "Légalité et RGPD à moto", paras: [
        "Les mêmes règles qu’en voiture s’appliquent : usage légal, diffusion de tiers encadrée par le RGPD, conservation limitée. Sur la voie publique, les enregistrements destinés à votre assurance ou aux forces de l’ordre en cas d’incident sont licites.",
      ] },
      { h2: "Quelle dashcam moto pour quel usage ?", paras: [
        "Balades occasionnelles, un seul casque : MOMAN H4C ou FreedConn R1 Plus. Plusieurs motos, zéro câblage : FreedConn R1 Pro. Trajets quotidiens toute l’année : VSYS D6WL/D6RL, étanche et double caméra. Confort de navigation + enregistrement : JMCQ DVR 6,86 pouces ou Jansite 8,1 pouces. Sorties en groupe avec intercom : Fodsports FX60C en 4K stabilisée.",
      ] },
    ],
    faq: [
      { q: "Une dashcam moto résiste-t-elle au lavage haute pression ?", a: "Les indices IP67/IPX7 oui, dans la limite du raisonnable et en évitant les jets directs sur les connecteurs. IP65 appelle plus de prudence." },
      { q: "Quelle autonomie pour une caméra de casque ?", a: "Elle dépend du modèle et de la résolution ; comptez typiquement une journée de balade, à recharger en USB-C le soir. La FX60C annonce une batterie de 2 000 mAh." },
      { q: "Peut-on filmer en roulant et diffuser en direct ?", a: "Certains écrans connectés proposent le Wi-Fi ou la 4G selon la variante ; les caméras de casque enregistrent localement et se consultent après coup via l’application." },
      { q: "La dashcam moto remplace-t-elle un intercom ?", a: "Les modèles FreedConn R1 Plus/Pro et Fodsports FX60C intègrent un intercom Bluetooth ; les systèmes fixes (VSYS, JIUYIN) ne couvrent que l’enregistrement." },
    ],
  },
  {
    slug: "meilleure-dashcam-voiture",
    title: "Meilleure dashcam voiture 2026 : le comparatif pour choisir sans se tromper",
    description: "Notre comparatif des critères qui comptent : résolution, angle, avant/arrière, mode parking, stockage — et la sélection NORTICAM par profil d’usage.",
    intro: "Meilleure dashcam ne veut pas dire plus chère : cela veut dire adaptée à votre usage. Ce comparatif pose les critères qui changent vraiment la qualité de vos enregistrements, puis décline notre sélection par profil de conducteur.",
    sections: [
      { h2: "En bref : les 5 critères qui comptent", paras: [
        "1) La résolution : 2K est le bon minimum en 2026, la 4K se justifie surtout pour la nuit. 2) L’angle de vue : entre 120° et 150°, jamais plus. 3) La configuration : avant seule pour un usage classique, avant/arrière pour les stationnements exposés. 4) Le mode parking : indispensable uniquement si le véhicule dort dehors. 5) Le stockage : une carte microSD haute endurance vaut mieux que n’importe quelle option.",
      ] },
      { h2: "Résolution : ce que la 4K change vraiment", paras: [
        "À vitesse stabilisée, une 2K capture les plaques jusqu’à une distance utile. La 4K gagne là où la 2K souffre : la nuit, les tunnels, les éblouissements, et chaque fois qu’un crop d’image est nécessaire. À l’inverse, elle double le poids des fichiers — donc la fréquence d’écrasement sur la carte. Nos références : 70mai A510 (3K HDR, capteur Sony IMX675) pour l’équilibre, DDPAI Z50 Pro et 70mai A810S (4K) pour la nuit.",
      ] },
      { h2: "Avant seule, avant/arrière ou 360° ?", paras: [
        "L’avant seule reste la réponse pour 70 % des conducteurs. L’avant/arrière (DDPAI N1 Dual, 70mai A510, DDPAI N5 Dual) devient prioritaire si votre véhicule stationne en rue. La 360° rotative (70mai X800 Omni) couvre les angles morts au créneau — le cas d’usage le plus difficile à filmer autrement.",
      ] },
      { h2: "Le mode parking : ce qu’il faut en attendre", paras: [
        "Surveillance 24 h à 48 h selon les modèles, par détection de choc, de mouvement ou en timelapse. Deux conditions non négociables : un kit d’alimentation permanente avec protection de batterie (presque toujours vendu séparément) et des attentes réalistes — la caméra documente les événements, elle ne prévient personne en temps réel.",
      ] },
      { h2: "Les erreurs qui coûtent cher", paras: [
        "Acheter sans carte microSD haute endurance. Activer le mode parking sans kit de protection de batterie. Choisir sur le seul nombre de mégapixels. Positionner la caméra derrière la zone balayée par les essuie-glaces. Oublier de vérifier la disponibilité réelle des variantes avant de commander.",
      ] },
      { h2: "Notre sélection 2026 par profil", paras: [
        "Budget serré, première dashcam : 70mai M310 Plus (2K, moins de 100 €) ou DDPAI MINI Pro. Usage mixte ville/route : 70mai A510, le meilleur équilibre du catalogue. Priorité nuit et récupération rapide des vidéos : DDPAI Z50 Pro. Couverture maximale et angles morts : 70mai X800 Omni. Preuve nocturne de l’habitacle (VTC, navettes) : AZDOME M550 Pro. Rétroviseur numérique : WOLFBOX G930.",
      ] },
    ],
    faq: [
      { q: "Quelle est la meilleure dashcam voiture pour un usage quotidien ?", a: "Pour des trajets quotidiens, une 2K/3K avec Wi-Fi et bonne vision nocturne couvre l’essentiel à prix contenu. Notre choix d’équilibre : la 70mai A510 en kit avant/arrière." },
      { q: "La dashcam est-elle légale en France ?", a: "Oui. Seule la diffusion publique de vidéos où des tiers sont identifiables est encadrée par le RGPD ; l’usage personnel et la transmission à votre assurance sont licites." },
      { q: "Faut-il la 4K pour lire les plaques ?", a: "Non en journée ; oui si vous roulez beaucoup de nuit ou d’autoroute. Les modèles de notre sélection 4K (Z50 Pro, A810S, N5 Dual) restent lisibles là où une Full HD sature." },
      { q: "Quelle carte mémoire choisir ?", a: "Une microSD haute endurance (TLC) de 128 Go minimum, classe U3 pour la 4K. C’est le poste le plus rentable de l’installation." },
      { q: "La dashcam est-elle utile pour un délit de fuite ?", a: "Oui, à condition que le mode parking soit actif et alimenté : la séquence horodatée documente le choc et, selon l’angle, le véhicule responsable." },
    ],
  },
];

/* ------------------------------ Sous-catégories (pages argent) ------------------------------ */

type SubCategory = { route: string; label: string; title: string; description: string; intro: string[]; handles: string[]; faq: Faq[] };

const SUBCATEGORIES: SubCategory[] = [
  {
    route: "/dashcam-voiture-360",
    label: "Dashcams voiture 360°",
    title: "Dashcam voiture 360° : couvrir tous les angles | NORTICAM",
    description: "Caméras rotatives 360° pour voiture : comment elles couvrent les angles morts au créneau, et le modèle 70mai X800 Omni disponible chez NORTICAM.",
    intro: [
      "Une dashcam classique regarde devant — parfois derrière. Une dashcam 360° regarde partout : son objectif rotatif balaie l’avant, les flancs et l’arrière du véhicule, là où un couple de caméras fixes laisse des angles morts.",
      "Cas d’usage typique : le créneau en ville. C’est le point de contact le plus fréquent entre votre carrosserie et le monde extérieur, et aussi le moins bien filmé par une configuration classique. La rotation motorisée de la X800 Omni répond exactement à ce besoin.",
    ],
    handles: ["dashcam-voiture-360-4k"],
    faq: [
      { q: "Comment fonctionne une dashcam voiture 360° ?", a: "Une dashcam 360° utilise un objectif grand angle rotatif — motorisé sur la 70mai X800 Omni — qui balaie l’ensemble des abords du véhicule, au lieu de deux caméras fixes orientées route et hayon." },
      { q: "La 360° remplace-t-elle un kit avant/arrière ?", a: "Elle couvre une zone plus large qu’un couple avant/arrière fixe, mais avec une résolution par direction souvent inférieure. Pour la preuve de route pure, l’avant/arrière reste plus précis ; pour les angles morts et le stationnement, la 360° excelle." },
      { q: "Le mode parking fonctionne-t-il en 360° ?", a: "Oui : la X800 Omni propose une surveillance de stationnement avec le kit d’alimentation compatible. La rotation permet d’orienter la caméra vers la direction de l’événement détecté." },
    ],
  },
  {
    route: "/dashcam-avant-arriere",
    label: "Dashcams avant/arrière",
    title: "Dashcam avant arrière : doubler la preuve | NORTICAM",
    description: "Pourquoi ajouter une caméra arrière à votre dashcam : tamponnages, créneaux, délits de fuite — et les modèles double caméra du catalogue NORTICAM.",
    intro: [
      "La majorité des sinistres documentés concernent l’avant du véhicule. Mais les litiges les plus pénibles naissent souvent de l’arrière : tamponnage à l’arrêt dont la responsabilité se discute, coup de pare-chocs au créneau découvert le lendemain, délit de fuite de nuit.",
      "Une dashcam avant/arrière enregistre les deux directions en continu. Le surcoût se limite à une caméra et un câble ; le gain est une preuve complète là où l’incident se produit réellement.",
    ],
    handles: ["dashcam-3k-voiture", "dashcam-wifi-5ghz", "dashcam-4k-avant-arriere", "dashcam-avant-arriere"],
    faq: [
      { q: "Pourquoi choisir une dashcam avant arrière ?", a: "Parce que l’arrière du véhicule concentre des sinistres mal documentés : tamponnages à l’arrêt, chocs en stationnement et délits de fuite. Deux caméras transforment un récit en preuve horodatée." },
      { q: "Comment se passe le câblage de la caméra arrière ?", a: "Un câble gagne le hayon via les montants et le joint de coffre — aucun perçage. Comptez 45 minutes à 2 heures selon le véhicule ; un installateur professionnel est un bon investissement sur certaines carrosseries." },
      { q: "La caméra arrière filme-t-elle la nuit ?", a: "Oui, et la qualité dépend du capteur : les modèles 70mai (Sony IMX675) et DDPAI (NightVIS) gardent l’arrière lisible là où des modèles d’entrée de gamme n’enregistrent qu’un halo." },
    ],
  },
  {
    route: "/dashcam-voiture-4k",
    label: "Dashcams 4K",
    title: "Dashcam voiture 4K : la netteté qui change tout | NORTICAM",
    description: "Les dashcams 4K du catalogue NORTICAM : ce que la 4K change vraiment pour les plaques et la nuit, et comment choisir votre modèle.",
    intro: [
      "La 4K n’est pas qu’un argument marketing : c’est quatre fois plus de pixels qu’en Full HD, donc la possibilité de zoomer après coup sur une plaque, un feu ou un visage sans perdre la lisibilité de la scène.",
      "Elle prend tout son sens la nuit et sur autoroute, là où la vitesse et la faible lumière écrasent les images des capteurs d’entrée de gamme. Prix à payer : des fichiers plus lourds et une carte microSD U3 recommandée.",
    ],
    handles: ["dashcam-4k", "dashcam-wifi-5ghz", "dashcam-4k-avant-arriere", "dashcam-voiture-360-4k", "dashcam-voiture-vision-nocturne", "dashcam-retroviseur-sans-fil-wolfbox-g930"],
    faq: [
      { q: "La 4K est-elle utile en ville ?", a: "En journée, une bonne 2K suffit pour la plupart des situations urbaines. La 4K devient décisive à haute vitesse et en faible luminosité : nuit, tunnels, éblouissements." },
      { q: "Quelle carte microSD pour une dashcam 4K ?", a: "Une carte U3 haute endurance de 128 Go minimum. La 4K écrit en continu et les cartes grand public s’usent prématurément en quelques mois." },
      { q: "La 4K raccourcit-elle l’historique d’enregistrement ?", a: "Oui : les fichiers 4K occupent environ deux fois plus d’espace qu’en 2K. Avec une carte de 256 Go, il reste plusieurs jours d’historique en enregistrement en boucle." },
    ],
  },
  {
    route: "/dashcam-moto-casque",
    label: "Caméras de casque",
    title: "Dashcam moto casque : filmer depuis le casque | NORTICAM",
    description: "Caméras de casque et intercoms avec caméra : enregistrer vos sorties moto sans installer un seul câble sur la machine.",
    intro: [
      "La caméra de casque suit le pilote, pas la moto : elle enregistre là où vous regardez, fonctionne sur toutes vos machines et s’installe sans aucun câblage du véhicule.",
      "La sélection couvre deux familles : les intercoms avec caméra intégrée (FreedConn R1 Plus, R1 Pro, MOMAN H4C) qui doublent les fonctions de communication, et la Fodsports FX60C qui monte en 4K stabilisée pour les sorties en groupe.",
    ],
    handles: ["dashcam-moto-casque", "dashcam-moto-360", "dashcam-moto-sans-fil", "camera-casque-moto-4k"],
    faq: [
      { q: "Caméra de casque ou dashcam fixe sur la moto ?", a: "Le casque suit votre regard et fonctionne sur plusieurs motos, mais dépend d’une batterie à recharger. La fixe filme dès le démarrage sans y penser, au prix d’une installation définitive raccordée à la batterie." },
      { q: "Quelle autonomie pour une caméra de casque ?", a: "De quelques heures à une journée de balade selon le modèle et la résolution. La Fodsports FX60C annonce une batterie de 2 000 mAh rechargeable en USB-C." },
      { q: "Ces caméras intègrent-elles un intercom ?", a: "Oui pour les FreedConn R1 Plus, R1 Pro et la MOMAN H4C. Vérifiez la fiche de la variante choisie pour connaître les fonctions exactes." },
    ],
  },
  {
    route: "/ecran-moto-carplay",
    label: "Écrans moto CarPlay",
    title: "Écran moto CarPlay : naviguer et filmer | NORTICAM",
    description: "Écrans moto avec CarPlay, Android Auto et double caméra : notre sélection pour naviguer, appeler et enregistrer sur deux roues.",
    intro: [
      "L’écran moto connecté remplace le trio GPS + intercom + caméra par un seul appareil au guidon : navigation CarPlay ou Android Auto sans fil, appels via un casque Bluetooth et double enregistrement avant/arrière.",
      "Deux modèles composent la sélection : le JMCQ DVR 6,86 pouces, équilibré et lisible même en plein soleil, et le Jansite 8,1 pouces, le plus grand format du catalogue. Les deux s’alimentent via le faisceau ACC fourni — jamais en direct sur la batterie.",
    ],
    handles: ["dashcam-moto-carplay-dvr", "dashcam-moto-4k"],
    faq: [
      { q: "CarPlay ou Android Auto : lequel choisir ?", a: "Les deux écrans gèrent les deux protocoles sans fil : tout dépend de votre smartphone. Vérifiez simplement que votre téléphone est compatible avec l’un ou l’autre avant l’achat." },
      { q: "L’écran et la dashcam fonctionnent-elles en même temps ?", a: "Sur le JMCQ DVR, non : l’enregistrement et le mode CarPlay s’utilisent alternativement, en basculant sur l’interface DVR. Prévoyez l’écran pour la navigation et la caméra pour la preuve, chacune à son tour." },
      { q: "Un écran au guidon est-il légal ?", a: "L’usage d’un écran embarqué est encadré : la consultation en roulant doit rester limitée aux fonctions d’aide à la conduite. Configurez votre trajet à l’arrêt et pilotez ensuite par la voix." },
    ],
  },
];

function subCategoryPage(sub: SubCategory): Page {
  const selection = sub.handles.map((handle) => productByHandle(handle)).filter((product): product is Product => Boolean(product));
  const url = absoluteUrl(sub.route);
  return {
    route: sub.route,
    title: sub.title,
    description: sub.description,
    body: `<main class="seo-page"><p class="seo-kicker">${escapeHtml(sub.label)}</p><h1>${escapeHtml(sub.title.split(" | ")[0])}</h1><p class="seo-lead">${escapeHtml(sub.description)}</p>${sub.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<nav aria-label="Catégories"><a href="/boutique">Toute la gamme</a><a href="/dashcam-voiture">Dashcams voiture</a><a href="/dashcam-moto">Dashcams moto</a><a href="/mode-parking">Mode parking</a></nav><section><h2>Modèles de cette sélection</h2><div class="seo-grid">${selection.map(productCard).join("")}</div></section>${faqSection(sub.faq)}</main>`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: sub.label,
        url,
        numberOfItems: selection.length,
        itemListElement: selection.map((product, position) => ({ "@type": "ListItem", position: position + 1, url: absoluteUrl(productRoute(product)) || product.shopifyUrl, name: product.title })),
      },
      breadcrumbLd(sub.route, sub.label),
      faqLd(sub.faq),
    ],
  };
}

/* ------------------------------ Comparatifs X vs Y ------------------------------ */

type Comparison = { slug: string; title: string; description: string; productA: string; productB: string; intro: string[]; rows: Array<[string, string, string]>; verdicts: string[]; faq: Faq[] };

const COMPARISONS: Comparison[] = [
  {
    slug: "70mai-a510-vs-ddpai-z50-pro",
    title: "70mai A510 vs DDPAI Z50 Pro : laquelle choisir ?",
    description: "Comparatif 70mai A510 (3K HDR) vs DDPAI Z50 Pro (4K, Wi-Fi 5 GHz) : capteurs, nuit, transferts, mode parking — et notre avis selon votre profil.",
    productA: "dashcam-3k-voiture",
    productB: "dashcam-wifi-5ghz",
    intro: [
      "Deux kits avant/arrière du milieu de gamme, deux philosophies. La 70mai A510 mise sur le rapport qualité/prix avec un capteur Sony IMX675 et une définition 3K HDR ; la DDPAI Z50 Pro mise sur la 4K et des transferts Wi-Fi parmi les plus rapides de la catégorie.",
      "Fonctionnalités quasi équivalentes par ailleurs (GPS, ADAS, mode parking sur kit) : le choix se joue sur deux questions. Quel est votre usage de nuit ? Et à quel point la récupération de vidéos sur smartphone doit-elle être rapide ?",
    ],
    rows: [
      ["Caméra avant", "3K HDR (2592 × 1944 px)", "4K (3840 × 2160 px)"],
      ["Caméra arrière", "Incluse (kit 2 canaux)", "1080p incluse (kit 2 canaux)"],
      ["Capteur / nuit", "Sony IMX675, traitement nocturne 70mai", "NightVIS 2.0, traitement AI-ISP"],
      ["Connexion", "Wi-Fi + application 70mai", "Wi-Fi 5 GHz / Wi-Fi 6, jusqu’à 13 Mo/s"],
      ["Consultation", "Format compact, contrôle via application", "Écran IPS 3 pouces + application"],
      ["Mode parking", "24 h avec kit 70mai (non inclus)", "Jusqu’à 48 h en accéléré avec kit intelligent (non inclus)"],
      ["Tenue thermique", "−20 °C à 70 °C annoncés", "Supercondensateur"],
    ],
    verdicts: [
      "Vous roulez surtout de jour et le budget compte : la A510. Son 3K HDR avec capteur Sony couvre l’essentiel des besoins, et sa plage de températures annoncée rassure en été comme en hiver.",
      "Vous roulez la nuit, prenez l’autoroute ou partagez souvent vos vidéos : la Z50 Pro. La 4K et le NightVIS 2.0 gardent les détails exploitables, et ses transferts Wi-Fi 5 GHz suppriment la corvée de carte SD.",
      "Dans les deux cas, prévoyez une carte microSD haute endurance U3 : ni l’une ni l’autre n’en est livrée dans cette configuration.",
    ],
    faq: [
      { q: "Laquelle est la meilleure de nuit ?", a: "La Z50 Pro, grâce à la 4K et au traitement NightVIS 2.0. La A510 reste très correcte pour son prix grâce au capteur Sony IMX675." },
      { q: "Les deux filment-elles l’arrière ?", a: "Oui : chacune est vendue ici en configuration deux canaux, caméra avant et caméra arrière." },
      { q: "Le mode parking est-il inclus ?", a: "Ni l’une ni l’autre : il faut le kit d’alimentation compatible, vendu séparément (kit 70mai ou kit intelligent DDPAI selon le modèle)." },
    ],
  },
  {
    slug: "70mai-a510-vs-ddpai-n1-dual",
    title: "70mai A510 vs DDPAI N1 Dual : le match avant/arrière",
    description: "70mai A510 ou DDPAI N1 Dual pour votre dashcam avant/arrière ? Résolutions, nuit, GPS et écarts de prix comparés.",
    productA: "dashcam-3k-voiture",
    productB: "dashcam-avant-arriere",
    intro: [
      "Même objectif — filmer devant et derrière — et un écart de prix sensible. La 70mai A510 monte en 3K HDR avec capteur Sony et GPS intégré ; la DDPAI N1 Dual joue la sobriété : double enregistrement fiable et application aboutie, sans superflu.",
      "La question n’est pas laquelle est « meilleure », mais combien vous voulez investir pour quel niveau de preuve.",
    ],
    rows: [
      ["Définition avant", "3K HDR (2592 × 1944 px)", "Jusqu’à 1296p"],
      ["Caméra arrière", "Incluse (kit 2 canaux)", "1080p incluse"],
      ["Capteur / nuit", "Sony IMX675, traitement nocturne 70mai", "Technologie NightVIS"],
      ["GPS", "Intégré (vitesse et position sur la vidéo)", "Non annoncé sur cette référence"],
      ["Aide à la conduite", "ADAS, alertes vocales", "Non annoncé"],
      ["Pilotage", "Wi-Fi + application 70mai", "Application DDPAI"],
    ],
    verdicts: [
      "Budget prioritaire et usage urbain : la N1 Dual. Elle couvre l’avant/arrière à prix contenu et s’appuie sur une application éprouvée.",
      "Qualité d’image, trajets de nuit et données GPS gravées sur la vidéo : la A510. Le surcoût s’explique par le capteur Sony, le 3K HDR et l’ADAS.",
      "Dans les deux cas, comptez un kit d’alimentation si vous visez le mode parking, et une carte microSD haute endurance.",
    ],
    faq: [
      { q: "Quelle est la moins chère en double enregistrement ?", a: "La DDPAI N1 Dual : c’est la porte d’entrée avant/arrière du catalogue NORTICAM." },
      { q: "Laquelle affiche la vitesse sur la vidéo ?", a: "La 70mai A510, grâce à son GPS intégré — utile en cas de litige sur le trajet ou la vitesse." },
      { q: "Peut-on ajouter le mode parking ?", a: "Oui, avec le kit d’alimentation compatible vendu séparément (kit 70mai pour la A510, kit d’alimentation DDPAI selon la référence)." },
    ],
  },
  {
    slug: "freedconn-r1-plus-vs-fodsports-fx60c",
    title: "FreedConn R1 Plus vs Fodsports FX60C : la caméra de casque gagnante ?",
    description: "Comparatif des caméras de casque moto : FreedConn R1 Plus (1080p, intercom) contre Fodsports FX60C (4K stabilisée). Communication, autonomie, prix.",
    productA: "dashcam-moto-casque",
    productB: "camera-casque-moto-4k",
    intro: [
      "Deux caméras qui se fixent sur le casque, deux ambitions. La FreedConn R1 Plus se concentre sur l’essentiel — 1080p, intercom Bluetooth, réduction de bruit — à prix accessible. La Fodsports FX60C monte en gamme : 4K stabilisée, Bluetooth 5.4 pour les groupes et batterie 2 000 mAh.",
      "Le match oppose la simplicité efficace à l’image haut de gamme. Votre type de sortie tranche.",
    ],
    rows: [
      ["Vidéo", "1080p", "4K stabilisée, grand angle"],
      ["Communication", "Intercom Bluetooth, réduction de bruit", "Intercom Bluetooth 5.4, mode groupe"],
      ["Batterie", "Intégrée, autonomie selon usage", "2 000 mAh, recharge USB-C"],
      ["Étanchéité", "Conception prévue pour la moto", "IP65"],
      ["Extras", "Appels et guidage vocal", "Wi-Fi, commandes vocales"],
    ],
    verdicts: [
      "Sorties régulières en solo ou à deux, budget contenu : la R1 Plus. Elle remplace avantageusement un intercom classique tout en filmant vos trajets.",
      "Sorties en groupe, exigence de qualité d’image et de preuve : la FX60C. La stabilisation change radicalement le rendu des images embarquées, souvent tremblantes à cette échelle.",
      "Dans les deux cas, prévoyez une carte microSD compatible : elle n’est incluse avec aucune des deux.",
    ],
    faq: [
      { q: "Laquelle est la meilleure en groupe ?", a: "La FX60C et son Bluetooth 5.4 pensé pour la communication de groupe ; la R1 Plus couvre plutôt le duo et les appels." },
      { q: "La stabilisation change-t-elle vraiment quelque chose ?", a: "Oui. Sans stabilisation, les images de casque sont souvent tremblantes et peu exploitables : c’est l’argument principal de la FX60C." },
      { q: "S’adaptent-elles à tous les casques ?", a: "La compatibilité dépend du type de casque et des fixations incluses : vérifiez les accessoires de la variante choisie avant commande." },
    ],
  },
];

function comparisonPage(comparison: Comparison): Page | null {
  const left = productByHandle(comparison.productA);
  const right = productByHandle(comparison.productB);
  if (!left || !right) {
    console.warn(`[comparatif] Produit introuvable pour "${comparison.slug}" (A=${comparison.productA}, B=${comparison.productB}) — page ignorée.`);
    return null;
  }
  const route = `/comparatif/${comparison.slug}`;
  const url = absoluteUrl(route);
  const rows = comparison.rows.map(([label, a, b]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td></tr>`).join("");
  return {
    route,
    title: `${comparison.title} | NORTICAM`,
    description: comparison.description,
    body: `<main class="seo-page"><p class="seo-kicker">COMPARATIF NORTICAM</p><article><h1>${escapeHtml(comparison.title)}</h1><p class="seo-lead">${escapeHtml(comparison.description)}</p>${comparison.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<h2>Comparaison technique</h2><table class="seo-table"><thead><tr><th>Critère</th><th>${escapeHtml(left.shortTitle || left.title)}</th><th>${escapeHtml(right.shortTitle || right.title)}</th></tr></thead><tbody>${rows}</tbody></table><p>Prix catalogue au moment de la synchronisation : ${escapeHtml(euro(left.price))} contre ${escapeHtml(euro(right.price))}. Les variantes et disponibilités exactes sont sur les fiches produit.</p><h2>Notre avis par profil</h2>${comparison.verdicts.map((verdict) => `<p>${escapeHtml(verdict)}</p>`).join("")}<p><a class="seo-button" href="${productRoute(left)}">Voir la fiche ${escapeHtml(left.shortTitle || left.title)}</a> <a class="seo-button seo-button--outline" href="${productRoute(right)}">Voir la fiche ${escapeHtml(right.shortTitle || right.title)}</a></p>${faqSection(comparison.faq)}</article></main>`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: comparison.title,
        description: comparison.description,
        datePublished: buildDate,
        dateModified: buildDate,
        author: { "@type": "Organization", name: siteName, url: publicOrigin || undefined },
        publisher: { "@type": "Organization", name: siteName },
        mainEntityOfPage: url,
      },
      breadcrumbLd(route, comparison.title),
      faqLd(comparison.faq),
    ],
  };
}

/* --------------------------------- Pages --------------------------------- */

const pages: Page[] = [
  {
    route: "/",
    title: "Dashcam voiture et moto : comparer, choisir et acheter | NORTICAM",
    description: "Découvrez les dashcams voiture et moto NORTICAM : catalogue réel, comparatif, quiz de choix et guides d’installation.",
    body: `<main class="seo-page"><p class="seo-kicker">SÉCURITÉ AUTOMOBILE, SIMPLIFIÉE</p><h1>Chaque trajet mérite une preuve.</h1><p class="seo-lead">NORTICAM sélectionne des dashcams voiture et moto pour documenter les trajets et vous aider à choisir sans jargon.</p><p><a class="seo-button" href="/quiz">Trouver ma dashcam</a> <a class="seo-button seo-button--outline" href="/boutique">Découvrir la gamme</a></p><section><h2>La gamme NORTICAM</h2><div class="seo-grid">${products.slice(0, 6).map(productCard).join("")}</div></section><section><h2>Choisir selon votre usage</h2><ul><li><a href="/dashcam-voiture">Dashcams voiture</a></li><li><a href="/dashcam-moto">Dashcams moto</a></li><li><a href="/mode-parking">Dashcams pour le mode parking</a></li><li><a href="/dashcam-voiture-4k">Dashcams 4K</a></li><li><a href="/dashcam-voiture-360">Dashcams 360°</a></li><li><a href="/dashcam-avant-arriere">Dashcams avant/arrière</a></li><li><a href="/dashcam-moto-casque">Caméras de casque moto</a></li><li><a href="/ecran-moto-carplay">Écrans moto CarPlay</a></li><li><a href="/comparatif">Comparer les modèles</a></li></ul></section></main>`,
    schema: [
      { "@context": "https://schema.org", "@type": "Organization", name: siteName, url: publicOrigin || undefined, description: "Sélection de dashcams voiture et moto pour documenter les trajets." },
      breadcrumbLd("/", "Accueil"),
    ],
  },
  categoryPage("/boutique", "La sélection NORTICAM", "Boutique dashcam voiture et moto | NORTICAM", "Explorez le catalogue réel de dashcams voiture et moto, puis choisissez la configuration qui répond à votre usage.", products),
  categoryPage("/dashcam-voiture", "Dashcams voiture", "Dashcam voiture : modèles et prix | NORTICAM", "Découvrez les modèles voiture disponibles pour documenter vos trajets et comparer les options selon votre usage.", carDashcams),
  categoryPage("/dashcam-moto", "Dashcams moto", "Dashcam moto : modèles disponibles | NORTICAM", "Découvrez les dashcams moto disponibles et vérifiez les informations de montage, d’alimentation et de compatibilité.", motorcycleDashcams),
  categoryPage("/mode-parking", "Dashcams mode parking", "Dashcam mode parking : modèles disponibles | NORTICAM", "Explorez les modèles à comparer lorsque votre usage implique la surveillance du véhicule à l’arrêt.", parkingDashcams),
  {
    route: "/comparatif",
    title: "Comparatif dashcam voiture et moto : modèles et variantes | NORTICAM",
    description: "Comparez les modèles NORTICAM selon leur prix, leurs variantes et leur disponibilité avant de consulter les fiches produit complètes.",
    body: `<main class="seo-page"><p class="seo-kicker">COMPARATIF NORTICAM</p><h1>Comparer les modèles selon ce qui compte vraiment.</h1><p class="seo-lead">Comparez une première sélection de produits réels du catalogue, puis consultez leur fiche pour vérifier les options et compatibilités.</p><div class="seo-grid">${products.slice(0, 3).map(productCard).join("")}</div><section><h2>Nos comparatifs détaillés</h2><ul>${COMPARISONS.map((comparison) => `<li><a href="/comparatif/${comparison.slug}">${escapeHtml(comparison.title)}</a><p>${escapeHtml(comparison.description)}</p></li>`).join("")}</ul></section><p><a class="seo-button" href="/quiz">Trouver ma dashcam</a></p></main>`,
    schema: breadcrumbLd("/comparatif", "Comparatif"),
  },
  {
    route: "/quiz",
    title: "Quel dashcam choisir ? Quiz voiture et moto | NORTICAM",
    description: "Répondez à quelques questions pour trouver une catégorie de dashcam voiture ou moto adaptée à votre usage.",
    body: `<main class="seo-page"><p class="seo-kicker">LE QUIZ NORTICAM</p><h1>Quelques réponses. Un point de départ plus clair.</h1><p class="seo-lead">Le quiz NORTICAM vous oriente vers une catégorie de produits réellement disponible dans la boutique.</p><ol><li>Définissez votre véhicule et votre usage.</li><li>Identifiez la couverture recherchée.</li><li>Consultez les produits et variantes disponibles.</li></ol><p><a class="seo-button" href="/dashcam-voiture">Explorer les dashcams voiture</a> <a class="seo-button seo-button--outline" href="/dashcam-moto">Explorer les dashcams moto</a></p></main>`,
    schema: breadcrumbLd("/quiz", "Quiz"),
  },
  {
    route: "/conseils",
    title: "Conseils dashcam voiture et moto : choix et installation | NORTICAM",
    description: "Guides NORTICAM pour choisir une dashcam voiture ou moto, comprendre les critères utiles et préparer l’installation.",
    body: `<main class="seo-page"><p class="seo-kicker">CONSEILS NORTICAM</p><h1>Des explications utiles avant de choisir.</h1><p class="seo-lead">Des repères simples pour comprendre les configurations dashcam et préparer une installation cohérente.</p><section><h2>Guides NORTICAM</h2><ul>${guides.map((guide) => `<li><a href="/conseils/${guide.slug}">${escapeHtml(guide.title)}</a><p>${escapeHtml(guide.description)}</p></li>`).join("")}</ul></section></main>`,
    schema: [
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "Conseils dashcam NORTICAM", hasPart: guides.map((guide) => ({ "@type": "Article", headline: guide.title, url: absoluteUrl(`/conseils/${guide.slug}`) })) },
      breadcrumbLd("/conseils", "Conseils"),
    ],
  },
];

for (const guide of guides) {
  const url = absoluteUrl(`/conseils/${guide.slug}`);
  pages.push({
    route: `/conseils/${guide.slug}`,
    title: `${guide.title} | NORTICAM`,
    description: guide.description,
    body: `<main class="seo-page"><p class="seo-kicker">CONSEILS NORTICAM</p><article><h1>${escapeHtml(guide.title)}</h1><p class="seo-lead">${escapeHtml(guide.intro)}</p>${guide.sections.map((section) => `<h2>${escapeHtml(section.h2)}</h2>${section.paras.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}`).join("")}${guide.faq.length ? faqSection(guide.faq) : ""}<p><a class="seo-button" href="/boutique">Voir la sélection NORTICAM</a></p></article></main>`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: buildDate,
        dateModified: buildDate,
        author: { "@type": "Organization", name: siteName, url: publicOrigin || undefined },
        publisher: { "@type": "Organization", name: siteName },
        mainEntityOfPage: url,
      },
      breadcrumbLd(`/conseils/${guide.slug}`, guide.title),
      ...(guide.faq.length ? [faqLd(guide.faq)] : []),
    ],
  });
}

for (const sub of SUBCATEGORIES) pages.push(subCategoryPage(sub));

for (const comparison of COMPARISONS) {
  const page = comparisonPage(comparison);
  if (page) pages.push(page);
}

for (const product of products) {
  const metaDescription = product.seoDescription || `${product.title} : consultez le prix, les variantes disponibles et les informations essentielles avant achat chez NORTICAM.`;
  pages.push({
    route: productRoute(product),
    title: `${product.title} : prix, variantes et disponibilité | NORTICAM`,
    description: metaDescription,
    image: product.image,
    body: `<main class="seo-page"><p class="seo-kicker">${escapeHtml(product.vendor || siteName)}</p><article class="seo-product">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" width="900" height="900">` : ""}<div><h1>${escapeHtml(product.title)}</h1><p class="seo-lead">${escapeHtml(product.story || product.description)}</p><p class="seo-price">${escapeHtml(euro(product.price))}</p><p>${product.available ? "Disponible au moment de la synchronisation du catalogue." : "Indisponible au moment de la synchronisation du catalogue."}</p><h2>Informations essentielles</h2><ul>${product.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul><p><a class="seo-button" href="${escapeHtml(product.shopifyUrl)}">Voir et acheter sur Shopify</a></p></div></article></main>`,
    schema: [productSchema(product), breadcrumbLd(productRoute(product), product.title)],
  });
}

function inject(html: string, page: Page) {
  const canonical = page.canonical === null ? undefined : (page.canonical ?? absoluteUrl(page.route));
  const ogImage = page.image || DEFAULT_OG_IMAGE;
  const imageTags = ogImage ? `<meta property="og:image" content="${escapeHtml(absoluteImage(ogImage))}"><meta name="twitter:image" content="${escapeHtml(absoluteImage(ogImage))}">` : "";
  const canonicalTag = canonical ? `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">` : "";
  const robotsTag = page.noindex ? `<meta name="robots" content="noindex,follow">` : "";
  const schema = page.schema ? `<script type="application/ld+json">${JSON.stringify(Array.isArray(page.schema) ? page.schema : [page.schema]).replace(/</g, "\\u003c")}</script>` : "";
  const meta = `<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}">${robotsTag}<meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">${canonicalTag}${imageTags}${schema}`;
  const fallback = `<div id="root" data-seo-static><style>.seo-page{max-width:1180px;margin:0 auto;padding:72px 24px;font-family:Arial,sans-serif;color:#09162d;background:#f7f8fb}.seo-page h1{font-size:clamp(2.25rem,5vw,4.5rem);line-height:1.02;max-width:920px;margin:12px 0 20px}.seo-page h2{margin-top:48px}.seo-page h3{margin-top:28px}.seo-lead{font-size:1.15rem;line-height:1.7;max-width:720px;color:#46546d}.seo-kicker{letter-spacing:.13em;font-size:.75rem;font-weight:700;color:#1672d8}.seo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:22px;margin-top:24px}.seo-card{background:#fff;border-radius:22px;padding:18px}.seo-card img{display:block;width:100%;aspect-ratio:1;object-fit:contain;background:#eef1f4;border-radius:16px}.seo-card h2{font-size:1.15rem;margin:13px 0}.seo-card p{font-size:.9rem;line-height:1.6;color:#576278}.seo-card a{color:inherit}.seo-button{display:inline-block;background:#1672d8;color:#fff!important;padding:13px 20px;border-radius:999px;text-decoration:none;font-weight:700;margin:20px 8px 0 0}.seo-button--outline{background:#0a1730}.seo-product{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:52px;align-items:start}.seo-product>img{width:100%;aspect-ratio:1;object-fit:contain;border-radius:28px;background:#eef1f4}.seo-price{font-size:2rem;font-weight:800}.seo-table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;margin:24px 0}.seo-table th,.seo-table td{padding:12px 14px;text-align:left;border-bottom:1px solid #e8ecf1;font-size:.92rem;line-height:1.5}.seo-table thead th{background:#0a1730;color:#fff}@media(max-width:720px){.seo-page{padding:42px 18px}.seo-product{grid-template-columns:1fr}}</style>${page.body}</div>`;
  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>/, "").replace(/<meta name="description"[^>]*>/, "").replace(/<meta name="robots"[^>]*>/, "");
  return withoutTitle.replace("</head>", `${meta}</head>`).replace('<div id="root"></div>', fallback);
}

const source = path.join(output, "index.html");
if (!fs.existsSync(source)) throw new Error("Le build Vite est introuvable : lancez ce script après vite build.");
const shell = fs.readFileSync(source, "utf8");
for (const page of pages) {
  const destination = page.route === "/" ? source : path.join(output, page.route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, inject(shell, page));
}

// Page 404 statique (utilisée par ErrorDocument dans .htaccess).
const notFound = inject(shell, {
  route: "/404",
  canonical: null,
  noindex: true,
  title: "Page introuvable | NORTICAM",
  description: "La page demandée n’existe pas ou a été déplacée. Retrouvez la sélection NORTICAM de dashcams voiture et moto.",
  body: `<main class="seo-page"><p class="seo-kicker">ERREUR 404</p><h1>Cette page a pris la route sans dashcam.</h1><p class="seo-lead">L’adresse demandée n’existe pas ou a été déplacée.</p><p><a class="seo-button" href="/">Retour à l’accueil</a> <a class="seo-button seo-button--outline" href="/boutique">Voir la gamme</a></p></main>`,
  schema: breadcrumbLd("/404", "Page introuvable"),
});
fs.writeFileSync(path.join(output, "404.html"), notFound);

const robotsPath = path.join(output, "robots.txt");
const robots = ["User-agent: *", "Allow: /", "Disallow: /cart", "Disallow: /checkout", ...(publicOrigin ? [`Sitemap: ${publicOrigin}/sitemap.xml`] : [])].join("\n") + "\n";
fs.writeFileSync(robotsPath, robots);

// Les routes publiques sont déjà générées comme dossiers avec index.html.
// On ne réécrit donc pas toutes les URL vers l’accueil : cela préserverait mal
// les 404 légitimes pour les produits ou articles inexistants.
const htaccess = `Options -MultiViews
DirectoryIndex index.html
ErrorDocument 404 /404.html

RewriteEngine On

# Un seul hôte canonique : www.norticam.com -> norticam.com.
RewriteCond %{HTTP_HOST} ^www\\.norticam\\.com$ [NC]
RewriteRule ^ https://norticam.com%{REQUEST_URI} [R=301,L]

# En-têtes sûrs pour la version statique, sans bloquer les médias Shopify CDN.
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
</IfModule>
`;
fs.writeFileSync(path.join(output, ".htaccess"), htaccess);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((page) => !page.noindex).map((page) => `  <url><loc>${absoluteUrl(page.route)}</loc><lastmod>${buildDate}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(output, "sitemap.xml"), sitemap);
console.log(`Pré-rendu SEO : ${pages.length} pages, 404.html et sitemap (lastmod ${buildDate}) générés pour ${publicOrigin}.`);
