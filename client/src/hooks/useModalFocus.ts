import { useEffect, useRef } from 'react';
export function useModalFocus(open: boolean, close: () => void) {
  const ref = useRef<HTMLElement>(null); const closeRef = useRef(close); closeRef.current = close;
  useEffect(() => {
    if (!open) return; const previous = document.activeElement as HTMLElement; const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; ref.current?.focus();
    const listener = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); if (e.key !== 'Tab') return; const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select,input,[tabindex="0"]') || []).filter(el => el.offsetParent !== null); const first = elements[0]; const last = elements.at(-1); if (!first) { e.preventDefault(); return; } if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } };
    document.addEventListener('keydown', listener); return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', listener); previous?.focus(); };
  }, [open]); return ref;
}
