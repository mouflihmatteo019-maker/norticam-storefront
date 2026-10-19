// Reuse the exact SSR image candidates: a second hand-maintained URL or sizes
// value can make mobile browsers download the preload and then another image.
export function heroImagePreload(html) {
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]).filter(tag => {
    const classes = tag.match(/\sclass="([^"]*)"/i)?.[1]?.split(/\s+/) || [];
    return classes.includes('norticam-road-hero__image');
  });
  if (images.length !== 1) throw new Error('Exactly one server-rendered road hero image is required for its preload.');
  const attribute = name => images[0].match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
  const src = attribute('src'), srcset = attribute('srcset'), sizes = attribute('sizes');
  if (!src || !srcset || !sizes) throw new Error('The hero preload requires the original src, srcset and sizes.');
  return `<link rel="preload" as="image" href="${src}" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
}
