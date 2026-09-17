import { useEffect, useState } from "react";

const messages = [
  <>
    <span aria-hidden="true">🇫🇷</span> Livraison gratuite en France
  </>,
  <>Paiement sécurisé au moment de finaliser votre commande</>,
  <>Quiz et comparatif gratuits pour choisir selon votre usage</>,
];

export function PromoBanner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex(current => (current + 1) % messages.length),
      5000
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div
      className="bg-slate-950 px-4 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-100"
      aria-live="off"
    >
      <span
        key={index}
        className="inline-block animate-in fade-in duration-300"
      >
        {messages[index]}
      </span>
    </div>
  );
}
