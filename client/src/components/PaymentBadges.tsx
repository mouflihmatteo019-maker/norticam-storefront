type Props = { compact?: boolean };

/** Keep these card-network badges in sync with the Shopify checkout configuration. */
export function PaymentBadges({ compact = false }: Props) {
  const size = compact ? "h-8" : "h-10";
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${compact ? "" : "mt-3"}`}
      aria-label="Paiement sécurisé par carte"
    >
      <span
        className={`${size} inline-flex min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 font-black italic tracking-tight text-[#1434cb] shadow-sm`}
        aria-label="Visa"
      >
        VISA
      </span>
      <span
        className={`${size} inline-flex min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 shadow-sm`}
        aria-label="Mastercard"
      >
        <i className="-mr-1 h-4 w-4 rounded-full bg-[#eb001b]" />
        <i className="h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
        <b className="sr-only">Mastercard</b>
      </span>
      <span
        className={`${size} inline-flex min-w-14 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-[10px] font-black tracking-tight text-[#006fc9] shadow-sm`}
        aria-label="American Express"
      >
        AMEX
      </span>
    </div>
  );
}
