import { ChevronDown, Cable, Package, SlidersHorizontal } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/store-data';
import { productPractical, selectedKitFacts, type PracticalFact } from '@/lib/product-practical';

export function ProductKitSelection({ selected }: { selected?: ProductVariant }) {
  return <div data-practical-selection aria-live="polite"><Facts facts={selectedKitFacts(selected)} /></div>;
}
function Facts({ facts }: { facts: PracticalFact[] }) {
  return <dl className="space-y-4">{facts.map(({ label, text }, index) => <div key={`${label}-${index}`}>
    <dt className="font-bold text-slate-900">{label}</dt>
    <dd className="mt-1 leading-relaxed text-slate-600">{text}</dd>
  </div>)}</dl>;
}

export function ProductPractical({ product, selected }: { product: Product; selected?: ProductVariant }) {
  const content = productPractical(product);
  const groups = [
    { id: 'usage', title: 'Au quotidien', Icon: SlidersHorizontal, facts: content.usage },
    { id: 'installation', title: 'Installation', Icon: Cable, facts: content.installation },
    { id: 'kit', title: 'Votre kit', Icon: Package, facts: content.preparation },
  ];
  return <section data-product-practical aria-label="Informations pratiques du produit" className="mt-5">
    <div className="grid items-start gap-2 sm:grid-cols-3">
      {groups.map(({ id, title, Icon, facts }) => <details key={id} data-practical-group={id} className="group min-w-0 rounded-2xl border border-slate-200 bg-white open:border-blue-200 open:bg-blue-50/40">
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-2 rounded-2xl px-3 py-4 text-xs font-bold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
          <Icon size={16} className="shrink-0 text-[#1672d8]" aria-hidden="true" />
          <span className="flex-1">{title}</span>
          <ChevronDown size={14} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <div className="border-t border-slate-100 px-3 pb-4 pt-4 text-xs">
          {id === 'kit' && <div className="mb-4"><ProductKitSelection selected={selected} /></div>}
          <Facts facts={facts} />
        </div>
      </details>)}
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-500">Une question sur votre installation ? <a className="font-semibold text-[#1266c3] underline underline-offset-2" href="mailto:contact@norticam.com">Demandez-nous conseil</a>.</p>
  </section>;
}
