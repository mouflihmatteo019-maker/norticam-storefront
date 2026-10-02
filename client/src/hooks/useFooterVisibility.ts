import { useEffect, useState } from 'react';

/** Hide the purchase bar before the footer enters its occupied screen area. */
export function useFooterVisibility() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector('[data-storefront-footer]');
    if (!footer) return;
    const update = () => setVisible(footer.getBoundingClientRect().top <= window.innerHeight + 120);
    update();
    if (typeof IntersectionObserver === 'undefined') {
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '0px 0px 120px 0px' });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return visible;
}
