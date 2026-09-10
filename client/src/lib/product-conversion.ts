import type { Product, ProductVariant } from './store-data';

// Editorial positioning, grounded in the documented catalogue. No price or kit assumptions.
const positioning: Record<string, [string,string]> = {
 'camera-casque-moto-4k':['filmer vos sorties en 4K tout en communiquant en groupe','Votre point de vue et vos échanges, sur le même équipement de casque.'],
 'dashcam-voiture-discrete-2k':['équiper vos trajets quotidiens avec une caméra compacte 2K','Gardez une trace de la route sans ajouter un grand écran dans l’habitacle.'],
 'dashcam-voiture-mini-2k':['privilégier une installation discrète derrière le rétroviseur','Un format mini pour filmer le quotidien et retrouver vos séquences sur téléphone.'],
 'dashcam-voiture-compacte-hdr':['privilégier le HDR et choisir vos options progressivement','Traitez les écarts de lumière sans choisir une caméra uniquement pour ses pixels.'],
 'dashcam-avant-arriere':['filmer devant et derrière sans écran encombrant','Un incident ne se joue pas toujours devant vous : conservez les deux points de vue.'],
 'dashcam-2k-voiture':['filmer en 2K avec un boîtier cylindrique discret','La route reste votre priorité ; la caméra en conserve le contexte.'],
 'dashcam-retroviseur-sans-fil-wolfbox-g930':['préférer un grand écran au format rétroviseur','Consultez l’image sur un écran tactile de 10 pouces intégré au format rétroviseur.'],
 'dashcam-4k':['donner la priorité au détail 4K et au traitement HDR','Plus de détail à examiner, avec un traitement adapté aux contrastes de la route.'],
 'dashcam-voiture-vision-nocturne':['choisir une couverture incluant l’habitacle selon le kit','L’extérieur et l’habitacle ne demandent pas le même éclairage : choisissez vos canaux.'],
 'dashcam-voiture-360-4k':['pouvoir orienter une caméra 4K autour du véhicule','Changez de point de vue avec une caméra rotative, sans confondre rotation et capture panoramique simultanée.'],
 'dashcam-4k-avant-arriere':['associer le détail 4K à une couverture avant et arrière','Le détail à l’avant et le contexte à l’arrière, réunis dans un système double caméra.'],
 'dashcam-moto-avant-arriere':['garder deux points de vue depuis un équipement fixé à la moto','Filmez le trajet depuis la moto avec deux caméras Full HD et un boîtier compact.'],
 'dashcam-moto-double-camera':['filmer les deux côtés du trajet et consulter les vidéos par Wi-Fi','Deux caméras fixes pour revoir ce qui s’est passé devant comme derrière la moto.'],
 'dashcam-moto-casque':['réunir vidéo 1080p et intercom sur le casque','Votre point de vue en vidéo et vos communications dans un équipement de casque.'],
 'dashcam-moto-sans-fil':['filmer depuis le casque sans câbler la moto','Emportez la caméra avec vous et reliez votre smartphone par Wi-Fi ou Bluetooth.'],
 'dashcam-moto-4k':['associer navigation sur grand écran et caméra avant 4K','Retrouvez la navigation et l’enregistrement dans une configuration dédiée à la moto.'],
 'dashcam-moto-etanche':['privilégier un système moto double caméra conçu pour l’eau','Une couverture avant et arrière adaptée à l’usage moto, avec accès aux vidéos par Wi-Fi.'],
 'dashcam-moto-2k':['privilégier un boîtier fixe discret et une image 2K','Conservez vos trajets en 2K sans choisir une caméra portée sur le casque.'],
 'dashcam-moto-360':['orienter une caméra de casque avec intercom','Réglez le point de vue de la caméra tout en conservant les fonctions de communication.'],
 'dashcam-wifi-5ghz':['associer couverture double, détail 4K et transfert Wi-Fi','Filmez devant et derrière, puis récupérez les séquences utiles via une connexion Wi-Fi rapide.'],
 'dashcam-moto-carplay-dvr':['réunir navigation connectée et DVR double caméra sur la moto','Navigation, connexion au casque et deux points de vue dans une configuration à installer sur la moto.'],
 'dashcam-3k-voiture':['chercher un kit avant arrière avec image avant 3K et GPS','Reliez les images du trajet à leur contexte avec une caméra arrière incluse et le GPS.'],
};
export function benefitFor(feature: string): string {
 if (/selon|accessoires|à vérifier/i.test(feature)) return 'Choisissez le kit qui inclut cette fonction pour éviter de payer un équipement inadapté ; sa présence dépend de la configuration.';
 if (/infrarouge/i.test(feature)) return 'Enregistrez aussi l’habitacle peu éclairé ; cette fonction ne garantit pas la lecture des plaques à l’extérieur.';
 if (/avant.*arrière|double caméra/i.test(feature)) return 'Conservez deux points de vue pour mieux comprendre un incident devant ou derrière vous.';
 if (/stabilis/i.test(feature)) return 'Limitez les tremblements dans les images embarquées pour revoir plus confortablement vos sorties.';
 if (/HDR|NightVIS|nocturne|IMX/i.test(feature)) return 'Mieux gérer les scènes contrastées ou peu éclairées aide à conserver leur contexte ; la lisibilité dépend toujours des conditions.';
 if (/4K|3K|2K|1440p|1080p/i.test(feature)) return 'Revenez sur les détails de votre trajet après un imprévu, sans dépendre uniquement de vos souvenirs.';
 if (/Wi-Fi|application/i.test(feature)) return 'Consultez et récupérez les séquences avec l’application compatible, à proximité de la caméra.';
 if (/GPS/i.test(feature)) return 'Complétez l’image par le contexte de localisation, sans le confondre avec un suivi à distance.';
 if (/boucle/i.test(feature)) return 'La mémoire est réutilisée au fil des trajets : exportez rapidement les vidéos que vous souhaitez conserver.';
 if (/intercom|Bluetooth/i.test(feature)) return 'Gardez vos communications accessibles avec un équipement compatible, sans manipuler votre téléphone en roulant.';
 if (/CarPlay|Android Auto/i.test(feature)) return 'Retrouvez les fonctions compatibles du téléphone sur l’écran dédié à la moto.';
 if (/parking|stationnement/i.test(feature)) return 'Préparez l’enregistrement lorsque vous quittez le véhicule, avec l’alimentation compatible requise.';
 if (/compact|discret|mini/i.test(feature)) return 'Intégrez la caméra à votre véhicule en limitant son encombrement visuel.';
 if (/batterie|USB-C/i.test(feature)) return 'Prévoyez la recharge avant la sortie pour disposer d’un équipement prêt à filmer.';
 return 'Un point concret à comparer avec votre installation et votre usage, sans ajouter de fonction non documentée.';
}
export function conversionCopy(product: Product) {
 const [ideal, promise] = positioning[product.handle] || ['documenter vos trajets avec la configuration adaptée', product.description];
 const features = product.details.filter(d=>! /stock fournisseur|disponibilité conseillé/i.test(d));
 const helmet = /casque/i.test(product.description) && !/CarPlay/i.test(product.description);
 const moto = /moto/i.test(product.productType);
 const kit = features.filter(d=>/inclus|fourn[iy]|vendu séparément|non inclu|requis/i.test(d));
 const parking = features.find(d=>/parking|stationnement/i.test(d));
 const installation = helmet ? ['Vérifiez les fixations autorisées pour votre casque et le positionnement du module.','Chargez la batterie selon la notice, puis préparez la carte mémoire compatible.','Réglez l’angle et faites une courte séquence à l’arrêt avant votre première sortie.'] : ['Choisissez les emplacements sans gêner la visibilité ni les équipements de sécurité.','Vérifiez l’alimentation, les supports et le passage des câbles ; confiez le raccordement permanent à une personne compétente.','Formatez la carte selon la notice, réglez l’angle puis contrôlez un premier enregistrement à l’arrêt.'];
 const faq: [string,string][] = [
  ['Est-ce le bon modèle pour mon usage ?', `Ce modèle est pertinent pour ${ideal}. Si vous cherchez une autre couverture ou un autre montage, comparez ces critères avant de choisir la résolution.`],
  ['Que dois-je vérifier pour mon véhicule ?', helmet ? 'La compatibilité du support avec votre casque, l’emplacement des écouteurs si présents et les recommandations du fabricant du casque. Ne percez pas le casque pour adapter une fixation.' : `Vérifiez le point de fixation, l’alimentation et le passage des câbles${moto ? ', ainsi que la protection de chaque composant et connexion contre l’eau' : ', notamment jusqu’à l’arrière si vous choisissez deux caméras'}. Le nom du modèle ne garantit pas une compatibilité universelle.`],
  ['La carte mémoire et les accessoires sont-ils inclus ?', kit.length ? kit.join(' ')+' Pour le reste, consultez la configuration sélectionnée : une option proposée n’est pas forcément incluse dans tous les kits.' : 'Le catalogue ne précise pas une liste complète des accessoires inclus. Vérifiez la carte mémoire, les supports et l’alimentation avec NORTICAM avant de commander.'],
  ['Puis-je enregistrer lorsque le véhicule est garé ?', parking ? parking+' Vérifiez l’alimentation et les réglages requis dans la notice. La durée dépend de l’énergie disponible et de l’usage.' : 'Le mode parking n’est pas documenté pour ce modèle dans notre catalogue. Ne le choisissez pas pour cet usage sans confirmation préalable.'],
  ['Une vidéo garantit-elle la lecture de toutes les plaques ?', 'Non. Mouvement, distance, reflets et éclairage influencent la lisibilité. L’intérêt est de conserver le contexte d’une scène, sans promettre un résultat dans toutes les situations.'],
 ];
 const limit = product.handle==='dashcam-moto-carplay-dvr' ? 'Le catalogue précise que le DVR s’utilise hors mode CarPlay. Le faisceau ACC fourni est obligatoire ; ne choisissez pas ce modèle pour un usage simultané non confirmé.' : /360/.test(product.handle) ? 'Une caméra orientable à 360° ne capture pas nécessairement tous les angles simultanément. Vérifiez le fonctionnement et le kit avant achat.' : helmet ? 'Ce choix implique un équipement porté et rechargé avec le casque. Pour une installation qui reste sur la moto, comparez un kit fixe.' : 'Les caractéristiques décrivent la famille du modèle. La configuration sélectionnée détermine les accessoires fournis ; vérifiez les options avant ajout au panier.';
 return { ideal, promise, limit, benefits:features.slice(0,3).map(feature=>({feature,benefit:benefitFor(feature)})), kit, installation, faq };
}
export function initialVariant(variants: ProductVariant[], requested: string | null) {
 if (requested) return variants.find(v=>v.numericId===requested || v.id===requested);
 return variants.filter(v=>v.availableForSale).sort((a,b)=>a.price-b.price)[0] || variants[0];
}
