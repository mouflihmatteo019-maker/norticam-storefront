/** Design reference: NORTICAM storefront — dark automotive editorial commerce. */
export type Product = {
  id: string;
  handle: string;
  title: string;
  shortTitle: string;
  type: "Dashcam" | "Accessoire";
  price: number;
  description: string;
  badge: string;
  image?: string;
  emphasis?: "premium" | "standard";
  details: string[];
  story: string;
};

export const products: Product[] = [
  {
    id: "n1",
    handle: "norticam-n1-essentielle",
    title: "NORTICAM N1 — Essentielle",
    shortTitle: "N1 — Essentielle",
    type: "Dashcam",
    price: 129.9,
    badge: "Protection essentielle",
    image: "/manus-storage/norticam-road-context_acf59ef9.jpg",
    description: "La preuve qui vous accompagne au quotidien.",
    story: "Une solution pensée pour démarrer avec une couverture avant claire et discrète.",
    details: ["Vue avant grand angle", "Vision adaptée aux faibles lumières", "Mode parking à envisager"],
  },
  {
    id: "n2",
    handle: "norticam-n2-double-vision",
    title: "NORTICAM N2 — Double Vision",
    shortTitle: "N2 — Double Vision",
    type: "Dashcam",
    price: 169.9,
    badge: "Protection complète",
    image: "/manus-storage/norticam-hero-drive_f5ae2068.jpg",
    description: "Deux angles pour documenter davantage de contexte.",
    story: "Deux points de vue pour les conducteurs qui veulent mieux couvrir leur environnement.",
    details: ["Caméras avant et arrière", "Couverture plus complète", "Installation accompagnée"],
  },
  {
    id: "n3",
    handle: "norticam-n3-sentinel-4k",
    title: "NORTICAM N3 — Sentinel 4K",
    shortTitle: "N3 — Sentinel 4K",
    type: "Dashcam",
    price: 219.9,
    badge: "Choix premium",
    image: "/manus-storage/norticam-parking-protection_471a9412.jpg",
    description: "Une protection avancée pour les trajets qui comptent.",
    story: "Une solution avancée pour rechercher plus de détail et une couverture plus complète.",
    details: ["Définition 4K", "Couverture avant et arrière", "GPS selon vos préférences"],
    emphasis: "premium",
  },
  {
    id: "memory",
    handle: "carte-memoire-norticam-endurance",
    title: "Carte mémoire NORTICAM Endurance",
    shortTitle: "Carte mémoire Endurance",
    type: "Accessoire",
    price: 29.9,
    badge: "Accessoire sélectionné",
    description: "Prévoir le bon support pour vos enregistrements.",
    story: "Une carte pensée pour compléter votre dashcam avec un support adapté à l’enregistrement quotidien.",
    details: ["Conçue pour l’enregistrement", "Accessoire sélectionné", "Compatibilité à vérifier"],
  },
  {
    id: "kit",
    handle: "kit-installation-discret-norticam",
    title: "Kit d’installation discret NORTICAM",
    shortTitle: "Kit d’installation discret",
    type: "Accessoire",
    price: 39.9,
    badge: "Installation discrète",
    description: "Une installation plus intégrée pour votre dashcam.",
    story: "Un kit conçu pour accompagner une installation plus soignée et l’alimentation adaptée aux usages de stationnement.",
    details: ["Câbles plus discrets", "Installation accompagnée", "Configuration à vérifier"],
  },
];

export const dashcams = products.filter((product) => product.type === "Dashcam");
export const accessories = products.filter((product) => product.type === "Accessoire");
export const productByHandle = (handle?: string) => products.find((product) => product.handle === handle);
export const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
