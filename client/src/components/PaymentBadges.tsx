import { themeRuntime } from '@/lib/theme-runtime';
type Props = { compact?: boolean };

/** Keep these card-network badges in sync with the Shopify checkout configuration. */
export function PaymentBadges({ compact = false }: Props) {
  if (themeRuntime()) return <div aria-label="Moyens de paiement acceptés" className={`norticam-native-payments flex flex-wrap items-center justify-center gap-1.5 ${compact ? '' : 'mt-3'}`} dangerouslySetInnerHTML={{__html: themeRuntime()!.payments}} />;
  const size = compact ? "h-7" : "h-9";
  const width = compact ? "min-w-11 px-1.5" : "min-w-14 px-2";
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1.5 ${compact ? "" : "mt-3"}`}
      aria-label="Moyens de paiement acceptés"
    >
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-white font-black italic tracking-tight text-[#1434cb] shadow-sm`}
        aria-label="Visa"
      >
        VISA
      </span>
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm`}
        aria-label="Mastercard"
      >
        <i className="-mr-1 h-3.5 w-3.5 rounded-full bg-[#eb001b]" />
        <i className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] opacity-90" />
        <b className="sr-only">Mastercard</b>
      </span>
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-[9px] font-black tracking-tight text-[#006fc9] shadow-sm`}
        aria-label="American Express"
      >
        AMEX
      </span>
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-gradient-to-r from-[#0057a8] via-white to-[#e3001b] text-[9px] font-black tracking-tight text-white shadow-sm`}
        aria-label="Cartes Bancaires"
      >
        <span className="rounded bg-white/90 px-1 py-px text-[#075dbb]">CB</span>
      </span>
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-white font-semibold tracking-tight text-slate-950 shadow-sm`}
        aria-label="Apple Pay"
      >
        <span className="text-[13px] leading-none"></span>
        <span className="ml-0.5 text-[9px]">Pay</span>
      </span>
      <span
        className={`${size} ${width} inline-flex items-center justify-center rounded-md border border-slate-200 bg-white font-black italic tracking-tight text-[#0070e0] shadow-sm`}
        aria-label="PayPal"
      >
        <span className="text-[12px] leading-none">P</span>
        <span className="sr-only">PayPal</span>
      </span>
    </div>
  );
}
