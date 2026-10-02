/** Unverified testimonial graphics stay out of the public gallery until provenance is validated. */
export const testimonialMediaEnabled = false;
const testimonialFiles = ['IJFXipYnWXlQhIsc.webp', 'VVnzCepTbTwiFZvb.webp', 'MRFiQsTCroeEVXIe.webp', 'zZHpoeYoQgRkaEGW.webp', 'oQGjFFpAKYhpWXIF.webp'];
export function approvedProductMedia(image: { url: string; altText?: string | null }) {
  return testimonialMediaEnabled || !(testimonialFiles.some(file => image.url.split('?')[0].endsWith('/' + file)) || /gabarit|témoignage|retour d.utilisateur|avis client/i.test(image.altText || ''));
}
