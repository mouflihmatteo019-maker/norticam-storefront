import type { ProductVariant } from '@/lib/store-data';
export function VariantPicker({ variants, selected, onChange }: { variants: ProductVariant[]; selected?: ProductVariant; onChange: (id:string)=>void }) {
 if(variants.length < 2) return null;
 const names=Array.from(new Set(variants.flatMap(v=>v.options.map(o=>o.name)))).filter(n=>n!=='Title');
 if(!names.length) return <label className="mt-5 block text-sm font-bold">Configuration<select className="mt-2 block w-full rounded-xl border bg-white p-3" value={selected?.id} onChange={e=>onChange(e.target.value)}>{variants.map(v=><option key={v.id} value={v.id} disabled={!v.availableForSale}>{v.title}{v.availableForSale?'':' — indisponible'}</option>)}</select></label>;
 return <fieldset className="mt-6 space-y-4"><legend className="font-bold">Votre configuration</legend>{names.map(name=>{
  const values=Array.from(new Set(variants.flatMap(v=>v.options.filter(o=>o.name===name).map(o=>o.value))));
  return <label key={name} className="block text-sm font-bold">{name}<select className="mt-2 block w-full rounded-xl border bg-white p-3" value={selected?.options.find(o=>o.name===name)?.value || ''} onChange={e=>{
   const candidates=variants.filter(v=>v.availableForSale&&v.options.some(o=>o.name===name&&o.value===e.target.value));
   const best=candidates.find(v=>selected?.options.filter(o=>o.name!==name).every(o=>v.options.some(option=>option.name===o.name&&option.value===o.value))) || candidates[0];
   if(best) onChange(best.id);
  }}>{values.map(value=><option key={value} value={value} disabled={!variants.some(v=>v.availableForSale&&v.options.some(o=>o.name===name&&o.value===value))}>{value}</option>)}</select></label>;
 })}<p className="text-xs leading-5 text-slate-600" aria-live="polite">Sélection : {selected?.title}. Les options associées peuvent s’ajuster pour former une configuration disponible.</p></fieldset>;
}
