import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.TEST_URL || 'http://127.0.0.1:4190';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(base+'/produits/dashcam-3k-voiture/');await page.waitForSelector('[data-catalog-ready="true"]');
 await page.getByRole('link',{name:/100 avis/}).click();await page.waitForSelector('#avis-clients');assert.ok((await page.locator('#avis-clients article').count())===8);
 await page.getByRole('button',{name:'4 étoiles',exact:true}).last().click();assert.ok((await page.locator('#avis-clients article').count())===8);
 await page.getByRole('button',{name:/Afficher plus d’avis/}).click();assert.ok((await page.locator('#avis-clients article').count())>8);
 fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/reviews-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'test-results/reviews-mobile.png',fullPage:true});
 await page.goto(base+'/suivi-colis/');await page.getByRole('button',{name:'Suivre ma commande'}).click();assert.ok(await page.getByRole('alert').isVisible());
 await page.getByLabel('Numéro de commande').fill('#1001');await page.getByLabel('E-mail de commande').fill('client@example.fr');await page.getByRole('button',{name:'Suivre ma commande'}).click();assert.ok(await page.getByText('Le suivi en ligne n’est pas encore connecté.').isVisible());
 await page.goto(base+'/produits/dashcam-3k-voiture/');await page.getByRole('button',{name:'Ajouter au panier'}).first().click();await page.getByRole('button',{name:/Continuer vers le paiement sécurisé/}).click();await page.waitForURL(/checkout\.norticam\.com/,{timeout:60000});
 assert.deepEqual(errors,[]);console.log('Reviews desktop/mobile/filter/load-more/anchor + tracking errors + cart/checkout: PASS');
} finally {await browser.close();}
