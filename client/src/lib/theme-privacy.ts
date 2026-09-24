type Privacy = {
  currentVisitorConsent: () => {analytics: string; marketing: string};
  setTrackingConsent: (value: {analytics: boolean; marketing: boolean; preferences: boolean}, callback: () => void) => void;
};
export function loadThemePrivacy(): Promise<Privacy> {
  return new Promise((resolve,reject)=>{
    const shopify=(window as any).Shopify;
    if(shopify?.customerPrivacy) return resolve(shopify.customerPrivacy);
    if(!shopify?.loadFeatures) return reject(new Error('Service de confidentialité indisponible. Réessayez.'));
    shopify.loadFeatures([{name:'consent-tracking-api',version:'0.1'}],(error: unknown)=>{
      if(error || !shopify.customerPrivacy) reject(new Error('Service de confidentialité indisponible. Réessayez.'));
      else resolve(shopify.customerPrivacy);
    });
  });
}
export async function saveThemeConsent(analytics: boolean, marketing: boolean) {
  const api=await loadThemePrivacy();
  // Called only by an explicit banner interaction; never replay stored consent.
  await new Promise<void>((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('Enregistrement impossible. Réessayez.')),8000);
    api.setTrackingConsent({analytics,marketing,preferences:false},()=>{clearTimeout(timeout);resolve();});
  });
}
