import type { Product, ProductVariant } from './store-data';

export type PracticalFact = { label: string; text: string };
export type PracticalRecord = {
  usage: PracticalFact[];
  installation: PracticalFact[];
  preparation: PracticalFact[];
  sources: string[];
};
const fact = (label: string, text: string): PracticalFact => ({ label, text });
const cardCare = fact('Avant de rouler', 'Sauvegardez vos vidéos avant de formater la carte dans la caméra. Vérifiez régulièrement qu’un enregistrement récent est lisible.');
const localWifi = fact('Connexion au téléphone', 'Le Wi-Fi relie le téléphone à proximité de la caméra pour les réglages et les vidéos. Il ne donne pas, à lui seul, un accès à distance par Internet.');
const windscreen = fact('Pose au pare-brise', 'Testez le cadrage avant de fixer le support. Placez les câbles sans gêner la visibilité, les commandes ou les airbags.');
const wiredRear = fact('Caméra arrière', 'La caméra arrière se relie par câble : vérifiez le cheminement dans votre véhicule avant la pose définitive.');
const helmet = fact('Fixation au casque', 'Essayez le support sur votre casque avant de partir. Ne percez pas la coque et vérifiez que la fixation ne gêne ni la visière ni les mouvements de la tête.');
const electrical = fact('Raccordement', 'Pour un branchement électrique fixe, utilisez le faisceau prévu pour ce modèle et faites intervenir un installateur compétent.');
const kitCheck = fact('Avant le montage définitif', 'Effectuez un essai à l’arrêt : alimentation, cadrage et lecture d’une courte vidéo.');

// Reviewed against the product research dated 2026-10-09. Keys are Shopify product
// IDs, not URLs: changing a handle does not attach another model’s instructions.
// A manufacturer’s standard box is NOT treated as proof of our supplier’s kit.
export const practicalByProductId: Record<string, PracticalRecord> = {
  '16415887425885': {
    usage: [fact('Carte mémoire', 'MicroSD de 32 à 256 Go, Class 10 / U1 ou supérieure. Privilégiez une carte adaptée à l’enregistrement continu.'), fact('Application 70mai', 'Réglages et consultation locale des vidéos par Wi-Fi 2,4 GHz.'), cardCare],
    installation: [fact('Alimentation', 'Entrée 5 V / 2 A. Utilisez l’adaptateur adapté ; ne branchez jamais directement la caméra sur le 12 V du véhicule.'), windscreen, wiredRear, fact('Stationnement', 'L’enregistrement à l’arrêt nécessite une alimentation permanente compatible, distincte du branchement de trajet.')],
    preparation: [fact('Usage', 'La batterie interne de 500 mAh ne fait pas de l’A510 une caméra nomade à longue autonomie.'), kitCheck],
    sources: ['https://help.70mai.asia/'],
  },
  '16413273620829': {
    usage: [fact('Vidéo', 'Jusqu’à 4K 60 images/s en simple canal, ou 4K 30 images/s en double canal. Le réglage dépend de la configuration utilisée.'), fact('Rotation', 'L’objectif change de point de vue. Une rotation à 360° ne filme pas toutes les directions simultanément.'), localWifi, cardCare],
    installation: [windscreen, fact('Mode parking', 'Le kit UP03 apporte l’alimentation permanente nécessaire au stationnement. Suivez les consignes de raccordement et de protection de la batterie.'), electrical],
    preparation: [fact('Choisir le kit', 'Choisissez la caméra avant seule ou le kit avant et arrière, avec ou sans alimentation parking UP03. La carte mémoire est sélectionnée séparément.'), kitCheck],
    sources: ['https://www.70mai.com/'],
  },
  '16413273522525': {
    usage: [fact('Carte mémoire', 'MicroSD jusqu’à 512 Go. Choisissez une carte compatible avec la notice de l’A810S et l’enregistrement continu.'), fact('Application 70mai', 'Connexion Wi-Fi 6 pour les réglages et la consultation locale des séquences.'), cardCare],
    installation: [windscreen, fact('Alimentation', 'Le supercondensateur sert notamment à sécuriser l’arrêt des enregistrements. Il ne remplace pas une alimentation pendant vos trajets.'), fact('Stationnement', 'Un kit d’alimentation compatible est nécessaire pour les fonctions parking.')],
    preparation: [kitCheck],
    sources: ['https://www.70mai.com/'],
  },
  '16413273293149': {
    usage: [fact('Réglages vidéo', '1080p à 60 images/s sans HDR, ou 1080p à 30 images/s avec HDR. Choisissez selon votre priorité : fluidité ou gestion des contrastes.'), fact('Carte mémoire', 'MicroSD jusqu’à 256 Go, U1 ou supérieure, compatible avec l’enregistrement continu.'), localWifi, cardCare],
    installation: [windscreen, fact('Alimentation', 'L’A210 utilise un supercondensateur : elle doit rester alimentée pour filmer en trajet.'), fact('Stationnement', 'Les fonctions parking nécessitent une alimentation permanente compatible.')],
    preparation: [fact('Prise en main', 'L’écran de 1,9 pouce facilite le contrôle du cadrage avant le premier trajet.'), kitCheck],
    sources: ['https://www.70mai.com/'],
  },
  '16413273194845': {
    usage: [fact('Image', 'M310 Plus 2K : 2560 × 1440 à 30 images/s, angle de 143° et traitement WDR.'), fact('Carte mémoire', 'MicroSD de 16 à 256 Go. Formatez la carte dans la caméra après sauvegarde des fichiers.'), fact('Commandes vocales', 'Commandes vocales en anglais et en mandarin ; elles ne sont pas disponibles en français.')],
    installation: [fact('Branchement', 'Connecteur USB-C. Utilisez l’alimentation prévue pour la M310 Plus ; un connecteur identique ne suffit pas à garantir la compatibilité électrique.'), windscreen, fact('Cadrage', 'Le boîtier sans écran se règle avec le téléphone. L’objectif s’oriente manuellement ; il ne filme pas l’avant et l’arrière simultanément.'), fact('Stationnement', 'Prévoyez une alimentation parking compatible avec la M310 Plus 2K, distincte du branchement de trajet.')],
    preparation: [fact('Température', 'Plage de fonctionnement annoncée : −10 à 60 °C. Évitez une exposition prolongée au-delà de ces limites.'), kitCheck],
    sources: ['https://www.70mai.com/'],
  },
  '16415887360349': {
    usage: [fact('Carte mémoire', 'Z50 Pro Wi-Fi 5 GHz : microSD U3 jusqu’à 512 Go.'), fact('Application DDPAI', 'L’association et les réglages se font dans l’application. Le Wi-Fi sert au transfert local des vidéos.'), cardCare],
    installation: [fact('Alimentation', 'Entrée 5 V / 2 A, USB-C. Utilisez l’adaptateur compatible avec la caméra.'), windscreen, wiredRear, fact('Stationnement', 'Une alimentation parking compatible est nécessaire. Un branchement de trajet classique ne garantit pas le fonctionnement moteur arrêté.')],
    preparation: [kitCheck],
    sources: ['https://www.ddpai.com/manuals/z50pro/'],
  },
  '16413273653597': {
    usage: [fact('Application DDPAI', 'Effectuez l’activation initiale dans l’application avant votre premier trajet, puis vérifiez une vidéo d’essai.'), localWifi, cardCare],
    installation: [windscreen, wiredRear, electrical],
    preparation: [kitCheck],
    sources: ['https://www.ddpai.com/'],
  },
  '16413273456989': {
    usage: [fact('Vidéos et réglages', 'Utilisez l’application DDPAI pour le cadrage et la consultation locale. Vérifiez un fichier d’essai avant de rouler.'), cardCare],
    installation: [windscreen, fact('Alimentation', 'Utilisez l’adaptateur prévu pour la MINI Pro. Ne raccordez pas directement une entrée basse tension au 12 V du véhicule.'), fact('Stationnement', 'Le branchement parking nécessite un kit d’alimentation permanente compatible, distinct du branchement de trajet.')],
    preparation: [kitCheck],
    sources: ['https://www.ddpai.com/'],
  },
  '16413273358685': {
    usage: [fact('Deux vues', '1296p à l’avant et 1080p à l’arrière. Les deux caméras conservent deux points de vue, pas une vue panoramique à 360°.'), fact('Carte mémoire', 'MicroSD jusqu’à 256 Go, adaptée à l’enregistrement continu.'), fact('Application DDPAI', 'Réglages et consultation locale par Wi-Fi 2,4 GHz.'), cardCare],
    installation: [fact('Alimentation', 'Entrée 5 V / 1 A, connecteur Type-C. Utilisez l’adaptateur prévu pour la caméra.'), windscreen, wiredRear, fact('Stationnement', 'Le mode parking nécessite une alimentation permanente compatible avec la N1 Dual.')],
    preparation: [fact('Longueur de câble', 'Vérifiez le cheminement avant/arrière de votre véhicule avant de choisir une rallonge.'), kitCheck],
    sources: ['https://www.ddpai.com/'],
  },
  '16413273489757': {
    usage: [fact('Avant utilisation', 'Réglez l’angle de vue à l’arrêt et vérifiez la lecture d’une vidéo avant votre premier trajet.'), cardCare],
    installation: [fact('Rétroviseur', 'Vérifiez les dimensions et les points de fixation sur votre rétroviseur avant la pose. Gardez une visibilité et un réglage adaptés à la conduite.'), wiredRear, fact('Stationnement', 'Le mode parking nécessite un kit d’alimentation permanente compatible.'), electrical],
    preparation: [kitCheck],
    sources: ['https://wolfbox.com/'],
  },
  '16413273555293': {
    usage: [fact('Deux ou trois canaux', 'Choisissez une couverture avant et arrière, ou ajoutez la vue habitacle avec une configuration trois canaux.'), fact('Application AZDOME', 'Utilisez l’application AZDOME pour les réglages et la consultation des vidéos.'), cardCare],
    installation: [windscreen, fact('Câbles et caméras', 'Préparez le trajet des câbles en fonction du kit deux ou trois caméras avant de fixer les éléments.'), fact('Stationnement', 'Le mode parking nécessite une alimentation permanente compatible. Le faisceau doit être raccordé conformément à la notice.'), electrical],
    preparation: [fact('Carte et configuration', 'Les cartes microSD 64 Go et 128 Go sont proposées dans le sélecteur de configuration.'), kitCheck],
    sources: ['https://azdome.app/pages/downloads'],
  },
  '16413273260381': {
    usage: [fact('Avant le premier trajet', 'Vérifiez le cadrage sur le téléphone et la lecture d’une vidéo enregistrée.'), cardCare],
    installation: [windscreen, fact('Alimentation', 'Utilisez l’alimentation prévue pour la MINI3 et respectez les consignes de raccordement de sa notice.')],
    preparation: [kitCheck],
    sources: ['https://www.kawa-in.com/fr/pages/mini3'],
  },
  '16413274079581': {
    usage: [fact('Autonomie annoncée', 'Batterie 1 500 mAh : jusqu’à environ 6,5 h de vidéo et environ 3 h de recharge, selon les conditions et l’usage.'), fact('Carte mémoire', 'MicroSD jusqu’à 256 Go, adaptée à l’enregistrement continu.'), fact('Connexion', 'Application RoadCam et Wi-Fi pour les vidéos. Le Bluetooth audio n’est pas un intercom de groupe entre motards.')],
    installation: [helmet, fact('Orientation', 'L’objectif s’oriente à 360° pour ajuster le cadrage ; il ne filme pas toutes les directions à la fois.'), fact('Pluie', 'Protection annoncée IPX6 : pas d’immersion. Gardez les ports et capuchons correctement fermés.')],
    preparation: [fact('Avant une sortie', 'Rechargez la caméra, contrôlez la fixation et lancez un court enregistrement d’essai.'), kitCheck],
    sources: ['https://momanx.com/'],
  },
  '16413273817437': {
    usage: [fact('Autonomie annoncée', 'Environ 4,5 h de vidéo et 2,5 h de recharge. L’autonomie réelle varie avec les réglages, la température et l’usage.'), fact('Recharge', 'Alimentation de charge 5 V / 1 A. Utilisez un chargeur adapté.'), localWifi, cardCare],
    installation: [helmet, fact('Pluie', 'Protection annoncée IP65 : protégez les ports et ne plongez pas la caméra dans l’eau.'), fact('Préparation', 'Contrôlez le cadrage et la tenue du support avant chaque sortie.')],
    preparation: [fact('Avant une sortie', 'Rechargez la caméra et contrôlez la fixation avant le départ.'), kitCheck],
    sources: ['https://www.freedconn.net/'],
  },
  '16413273751901': {
    usage: [fact('Autonomie annoncée', 'Batterie 1 500 mAh : environ 4,5 h de vidéo et 2 h de recharge, selon l’usage.'), fact('Recharge', 'Alimentation de charge 5 V / 1 A. Rechargez avant une longue sortie.'), fact('Audio', 'Les fonctions Bluetooth et intercom nécessitent un appairage compatible. Testez l’audio et la vidéo avant de prendre la route.')],
    installation: [helmet, fact('Pluie', 'Protection annoncée IP65 : pas d’immersion et ports correctement fermés.')],
    preparation: [fact('Avant une sortie', 'Vérifiez charge, fixation, cadrage et lecture d’un enregistrement d’essai.'), kitCheck],
    sources: ['https://www.freedconn.net/'],
  },
  '16413273162077': {
    usage: [fact('Réglages vidéo', '4K à 30 images/s, 2K à 30 ou 60 images/s, ou 1080p à 30 ou 60 images/s.'), fact('Carte mémoire', 'MicroSD V30 / U3, non incluse. Vérifiez la capacité compatible dans la notice FX60C.'), fact('Autonomie annoncée', 'Batterie 2 000 mAh : environ 6 à 7 h de vidéo, recharge en 2 à 3 h. Ces durées varient selon l’utilisation.'), cardCare],
    installation: [helmet, fact('Cadrage', 'Angle de 130° et objectif orientable. Le réglage à 360° change le cadrage, sans capture panoramique simultanée.'), fact('Connexion', 'Appairez la vidéo et les fonctions intercom selon la notice ; le Wi-Fi ne fournit pas un accès Internet à distance.')],
    preparation: [fact('Avant une sortie', 'Prévoyez une carte compatible, rechargez la caméra et testez l’appairage audio avant le départ.'), kitCheck],
    sources: ['https://www.fodsports.com/'],
  },
  '16415887393117': {
    usage: [fact('Prise en main', 'Configurez le téléphone et testez une vidéo à l’arrêt avant le premier trajet.'), cardCare],
    installation: [fact('Pose sur la moto', 'Vérifiez la place disponible, la fixation et le passage des câbles. L’écran ne doit pas gêner les commandes ni les mouvements du guidon.'), electrical],
    preparation: [kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-carplay-dvr'],
  },
  '16413274014045': {
    usage: [cardCare],
    installation: [fact('Montage', 'Placez le support sans gêner les commandes et protégez le passage des câbles contre les frottements.'), electrical],
    preparation: [kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-2k'],
  },
  '16413273981277': {
    usage: [cardCare],
    installation: [fact('Pose des caméras', 'Testez les vues avant et arrière avant de fixer les éléments. Éloignez les câbles des zones chaudes, des commandes et des pièces mobiles.'), electrical, fact('Protection des connexions', 'Montez les joints et capuchons comme indiqué dans la notice. La résistance d’un boîtier ne garantit pas celle d’un connecteur laissé ouvert.')],
    preparation: [kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-etanche'],
  },
  '16413273882973': {
    usage: [fact('Premier essai', 'Configurez l’écran 8,1 pouces et testez l’enregistrement à l’arrêt. Vérifiez la lecture d’un fichier avant la sortie.'), cardCare],
    installation: [fact('Encombrement', 'Vérifiez la place disponible pour l’écran et son support sur votre moto. Il ne doit pas gêner le guidon, les instruments ou les commandes.'), electrical],
    preparation: [kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-4k'],
  },
  '16413273719133': {
    usage: [fact('Double caméra', 'Contrôlez séparément les cadrages avant et arrière lors du premier essai, puis vérifiez que les deux fichiers sont lisibles.'), cardCare],
    installation: [fact('Pose sur la moto', 'Repérez les emplacements des caméras et le trajet des câbles avant fixation. Évitez les zones chaudes, mobiles et exposées aux frottements.'), electrical],
    preparation: [fact('Première mise en route', 'Testez la carte et les deux vues à l’arrêt avant le montage définitif.'), kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-double-camera'],
  },
  '16413273686365': {
    usage: [fact('Deux points de vue', 'Testez les enregistrements avant et arrière et sauvegardez une courte vidéo d’essai avant votre première sortie.'), cardCare],
    installation: [fact('Câblage', 'Préparez le passage des câbles sans gêner la direction, les commandes ou les pièces mobiles. Vérifiez la longueur nécessaire avant la pose.'), electrical],
    preparation: [kitCheck],
    sources: ['https://norticam.com/products/dashcam-moto-avant-arriere'],
  },
};

export function productPractical(product: Pick<Product, 'id' | 'specs'>): PracticalRecord {
  const record = practicalByProductId[product.id.split('/').pop()!];
  if (record) return record;
  // Future Shopify products get safe preparation advice, never another model’s specs.
  return {
    usage: [cardCare],
    installation: [fact('Installation', 'Suivez les consignes de la notice pour le branchement et la fixation. Gardez les câbles à distance des commandes et des pièces mobiles.')],
    preparation: product.specs?.kit?.length ? product.specs.kit.map(text => fact('Inclus dans ce kit', text)) : [kitCheck],
    sources: [],
  };
}

export function selectedKitFacts(variant?: ProductVariant): PracticalFact[] {
  if (!variant) return [fact('Configuration', 'Sélectionnez une configuration disponible pour vérifier le kit.')];
  const facts: PracticalFact[] = [];
  const named = variant.options.filter(o => o.name !== 'Title');
  const selection = named.length ? named.map(o => o.value).join(' · ') : variant.title !== 'Default Title' ? variant.title : '';
  if (selection) facts.push(fact('Votre sélection', selection));
  const text = [variant.title, ...named.map(o => o.value)].join(' ');
  if (/\bNo (?:TF|SD) Card\b/i.test(text)) facts.push(fact('Carte mémoire', 'Sans carte mémoire : prévoyez une microSD compatible.'));
  if (/\bNO HW\b/i.test(text)) facts.push(fact('Kit parking', 'Le kit de câblage parking n’est pas inclus dans cette option.'));
  return facts;
}
