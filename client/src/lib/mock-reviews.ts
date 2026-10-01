/** PRIVATE VISUAL FIXTURES ONLY. Never export to schema, feeds or Shopify records. */
import { products, type Product } from './store-data';
export type Review = { id:string; author:string; rating:number; date:string; title:string; body:string; verified:boolean; images?:string[] };
const counts = [97,113,89,104,121,86,107,94,117,101,83,109,126,92,103,118,87,111,98,123,106,115,91,119,102,127,96,108];
const firstNames = ['Alexandre','Valérie','Yann','Laurent','Nathalie','Florian','Céline','Mathieu','Émilie','David','Amandine','Sébastien','Isabelle','Olivier','Justine','Damien','Audrey','Pascal','Marine','Quentin','Caroline','Marc','Anaïs','Christophe','Julie','Vincent','Alice','Guillaume','Pauline','Bertrand','Lucie','Arnaud','Delphine','Fabien','Élodie','Rémi','Coralie','Jean-Luc','Clémence','Philippe','Sarah','Benjamin','Claire','Loïc','Marion','Bruno','Noémie','Sylvain','Stéphanie','Victor','Sandrine','Jérôme','Mélanie','Cédric','Florence','Baptiste','Hélène','Anthony','Gaëlle','Franck','Estelle','Thibault','Sophie','Nicolas','Louise','Pierre','Éric','Manon','Julien','Camille','Thomas','Léa'];
const initials = ['M','B','D','R','L','G','P','C','F','V','S','T','A','N','H','J','E','K','O','W','I','Z','U'];
const experiences = [
  ['Ce que je cherchais', 'J’avais hésité avec un autre modèle. Au final, celui-ci correspond mieux à ce que je voulais faire, sans trop compliquer mon installation.'],
  ['Bonne première impression', 'Déballage et mise en place ce week-end. J’ai pris le temps de lire les instructions plutôt que de tout brancher au hasard. Pour le moment, rien à signaler.'],
  ['Un choix réfléchi', 'J’ai surtout regardé la compatibilité avant de commander. Content d’avoir fait cette vérification, la configuration est adaptée à mon équipement.'],
  ['Satisfait pour le moment', 'Quelques semaines d’utilisation maintenant. Pas de mauvaise surprise, je vais voir comment ça se comporte dans la durée.'],
  ['Conforme à la fiche', 'Pas d’écart entre ce que j’avais compris en lisant la description et ce que j’ai reçu. C’est ce que j’attendais.'],
  ['Prise en main tranquille', 'Je ne suis pas particulièrement bricoleur. En prenant mon temps et en préparant le montage, ça s’est bien passé.'],
  ['Bon choix pour mon usage', 'Ce n’était pas évident de choisir parmi tous les modèles. Le comparatif m’a aidé à faire le tri, je ne regrette pas mon choix.'],
  ['Installation terminée', 'J’ai préféré faire un premier essai avant de fixer définitivement le matériel. Ça m’a évité de devoir reprendre toute la mise en place.'],
  ['Ça correspond à mon besoin', 'Je ne voulais pas forcément le modèle le plus cher, mais quelque chose de cohérent avec mon usage. Celui-ci me convient.'],
  ['Rien à redire', 'Le matériel est en place depuis un petit moment. Je suis satisfait, tout simplement.'],
  ['Premier équipement', 'C’est mon premier achat de ce type. Il faut un peu de temps pour comprendre les réglages, mais ce n’est pas compliqué une fois lancé.'],
  ['Une fois installé, très bien', 'Le plus long pour moi a été de préparer le montage proprement. Je conseille de ne pas faire ça à la dernière minute.'],
  ['Bonne surprise', 'J’avais un peu peur de me tromper de configuration. Après vérification des références et installation, tout correspond.'],
  ['Choisi après comparaison', 'J’ai passé un moment à comparer les fiches et les différents accessoires. Ça valait le coup : je n’ai pas acheté d’option inutile.'],
  ['Pas de souci jusque-là', 'Utilisé régulièrement, sans problème particulier. Je garde la notice sous la main pour les réglages que je connais moins.'],
  ['Le bon compromis', 'Je cherchais un compromis plutôt que toutes les options possibles. Pour mes besoins, c’est suffisant.'],
  ['Montage soigné', 'J’ai fait l’installation en deux temps, d’abord pour tester, puis pour ranger correctement les câbles. Bien plus propre comme ça.'],
  ['Content du résultat', 'Les explications de la fiche m’ont permis de comprendre ce qu’il fallait prévoir avant de passer commande. Le résultat me convient.'],
  ['Simple et efficace', 'Pas grand-chose à ajouter : le produit correspond à ce que je voulais.'],
  ['Je referais ce choix', 'Avec le recul, je prendrais la même configuration. J’avais bien vérifié mes besoins avant et je n’ai pas eu à changer d’accessoire.'],
  ['Bien vérifier avant', 'Un conseil : prenez le temps de regarder la référence exacte et les options incluses. Après ça, la mise en place se passe beaucoup mieux.'],
  ['Équipement en place', 'J’ai attendu de l’avoir utilisé un peu avant de donner mon avis. À ce stade, je suis content de mon achat.'],
  ['Pas besoin de plus', 'J’avais tendance à vouloir toutes les options. Finalement, j’ai choisi selon mon utilisation réelle et ça me suffit.'],
  ['Usage régulier', 'Le produit est installé et je m’en sers régulièrement. Pas encore assez de recul pour parler de longévité, mais pour l’instant c’est positif.'],
];
const contexts = {
  car: ['Je roule surtout en ville.', 'Je fais principalement des trajets domicile-travail.', 'Prévu pour nos déplacements en famille.', 'Je passe pas mal de temps sur la route.', 'Installé sur ma voiture du quotidien.', 'Je l’ai choisi pour mes déplacements professionnels.', 'Je roule peu en semaine mais davantage le week-end.', 'Mon objectif était de mieux préparer les longs trajets.'],
  moto: ['Je roule surtout le week-end.', 'Je l’ai choisi pour mes sorties à moto.', 'Prévu pour mes trajets réguliers à deux-roues.', 'J’ai pris le temps de vérifier le montage avec mon équipement.', 'Je voulais préparer mon prochain road trip.', 'Je reprends la moto après quelques années.', 'Un premier essai sur un trajet que je connais bien.', 'Je privilégie un montage propre plutôt qu’une installation rapide.'],
  accessory: ['J’ai vérifié la référence de ma dashcam avant.', 'Acheté pour compléter mon installation.', 'Attention à bien choisir la version compatible.', 'J’ai consulté les informations du fabricant pour le montage.', 'La référence correspond à mon équipement.', 'Je l’ai pris en complément de mon matériel existant.', 'Le détail des compatibilités m’a été utile.', 'Je préférais préparer tout le matériel avant l’installation.'],
};
const reservations = [
  ['Un peu de préparation', 'Le produit me convient, mais j’ai mis plus de temps que prévu à faire une installation propre. Mieux vaut prévoir un moment au calme.'],
  ['Bien, après réglage', 'Globalement satisfait. J’aurais aimé des explications plus détaillées sur la prise en main ; j’ai fini par trouver dans la documentation.'],
  ['À voir dans la durée', 'Le premier essai est concluant. Je mets quatre étoiles car je manque encore de recul sur un usage prolongé.'],
  ['Correct pour mon usage', 'Ça répond à mon besoin. La préparation du montage m’a demandé un peu de patience, surtout pour garder un résultat propre.'],
];
function seed(value:string) { return Array.from(value).reduce((n,c)=>((n*31)+c.charCodeAt(0))>>>0,7); }
function mix(value:number) { let n=value>>>0; n=Math.imul(n^(n>>>16),0x45d9f3b); n=Math.imul(n^(n>>>16),0x45d9f3b); return (n^(n>>>16))>>>0; }
export function makeMockReviews(product: Product): Review[] {
  const base = seed(product.id);
  const position = products.findIndex(p => p.id === product.id);
  const count = counts[position >= 0 ? position % counts.length : base % counts.length];
  const category = product.type === 'Accessoire' ? 'accessory' : /moto|casque/i.test(product.productType + product.handle) ? 'moto' : 'car';
  const fourStars = Math.floor(count * (0.08 + (base % 3) * 0.01));
  return Array.from({length:count}, (_,index) => {
    const rank = (index * (count - 1) + base % count) % count;
    const rating = rank === 0 ? 2 : rank === 1 ? 3 : rank < fourStars + 2 ? 4 : 5;
    const experience = rating === 2 ? ['Pas adapté à mes attentes', 'J’ai probablement mal évalué mes besoins avant de choisir. Je prendrais une autre configuration si c’était à refaire.'] : rating === 3 ? ['Avis partagé', 'Le matériel est en place, mais la prise en main m’a demandé plus de temps que je pensais. Je vais continuer à l’utiliser avant de me faire un avis définitif.'] : rating === 5 ? experiences[(base + index * 7) % experiences.length] : reservations[mix(base + index * 13) % reservations.length];
    const context = contexts[category][mix(base + index * 97) % contexts[category].length];
    const date = new Date('2026-10-01T12:00:00Z');
    date.setUTCDate(date.getUTCDate() - (3 + base % 5 + Math.floor(index * 164 / count) + mix(base + index * 37) % 3));
    const firstName = firstNames[(base + index * 5) % firstNames.length];
    const initial = initials[(base + Math.floor(index / firstNames.length) + index * 3) % initials.length];
    return {
      id: `preview-${product.id.split('/').pop()}-${index + 1}`,
      author: index % 13 === 0 ? `${firstName.toLowerCase()}_${21 + (base + index) % 78}` : `${firstName} ${initial}.`,
      rating, date:date.toISOString(), title:experience[0],
      body: index % 5 === 0 ? experience[1] : index % 3 === 0 ? `${context} ${experience[1]}` : `${experience[1]} ${context}`,
      // Visual fixture only, never linked to purchase verification or a Shopify order.
      verified: index % 7 !== 0,
    };
  });
}
