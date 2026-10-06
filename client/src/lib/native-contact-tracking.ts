type ContactInteraction = 'contact_form_submit' | 'contact_email_opened';

/** Observe native interactions without reading fields, preventing submission, or replacing Shopify handlers. */
export function attachNativeContactTracking(container: Element | null, emit: (name: ContactInteraction) => void): () => void {
  if (!container) return () => {};
  const publish = (name: ContactInteraction) => { try { emit(name); } catch {} };
  const onSubmit = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form');
    if (form && container.contains(form) && form.querySelector('input[name="form_type"][value="contact"]')) publish('contact_form_submit');
  };
  const onClick = (event: Event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]');
    if (link && container.contains(link) && /^mailto:/i.test(link.getAttribute('href') || '')) publish('contact_email_opened');
  };
  container.addEventListener('submit', onSubmit, true);
  container.addEventListener('click', onClick, true);
  return () => {
    container.removeEventListener('submit', onSubmit, true);
    container.removeEventListener('click', onClick, true);
  };
}
