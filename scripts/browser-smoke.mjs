const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage(); const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('requestfailed', r => console.log('REQUEST FAILED', r.url().split('?')[0], r.failure()?.errorText));
const dir = process.env.SCREENSHOT_DIR || 'test-results'; fs.mkdirSync(dir, { recursive: true });
try {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').waitFor();
  console.log('HOME', await page.title());
  await page.screenshot({ path: dir + '/home-desktop.png', fullPage: true });
  await page.goto(base + '/produits/dashcam-3k-voiture');
  await page.getByRole('button', { name: 'Ajouter au panier', exact: true }).waitFor({ timeout: 60000 });
  await page.getByRole('button', { name: 'Ajouter au panier', exact: true }).click();
  await page.getByRole('button', { name: 'Continuer vers le paiement sécurisé' }).waitFor({ timeout: 30000 });
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]')?.textContent?.includes('Mise à jour du panier'));
  console.log('CART', (await page.getByRole('dialog').innerText()).slice(0,1000));
  assert.equal(await page.getByRole('dialog').getByRole('alert').count(), 0);
  await page.getByRole('button', { name: 'Augmenter', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]')?.textContent?.includes('Mise à jour du panier'));
  assert.match(await page.getByRole('dialog').innerText(), /Panier \(2\)/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Ouvrir le panier' }).click();
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]')?.textContent?.includes('Mise à jour du panier'));
  assert.match(await page.getByRole('dialog').innerText(), /Panier \(2\)/);
  await page.keyboard.press('Escape');
  for (const width of [360,390,768,1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/boutique','/dashcam-moto','/mode-parking','/comparatif','/quiz','/produits/dashcam-3k-voiture','/conseils/dashcam-avant-arriere-guide','/informations/contact','/inconnue']) {
      await page.goto(base+route, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').waitFor();
      assert.equal(await page.locator('h1').count(),1, route);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Overflow '+width+' '+route);
      if (width === 390 && ['/', '/comparatif','/produits/dashcam-3k-voiture'].includes(route)) await page.screenshot({ path: dir + '/' + (route === '/' ? 'home' : route.split('/').at(-1)) + '-mobile.png', fullPage:true });
    }
  }
  await page.goto(base+'/quiz', { waitUntil:'domcontentloaded' });
  for (const name of ['Une moto','Depuis mon casque','Le rapport équipement / prix','Non, surtout pendant les trajets','Jusqu’à 250 €']) await page.getByRole('button',{name:new RegExp(name)}).click();
  await page.getByRole('link',{name:'Découvrir ma dashcam'}).waitFor();
  await page.getByRole('link',{name:'Découvrir ma dashcam'}).click();
  await page.waitForURL('**/produits/**');
  await page.locator('h1').filter({hasText:/moto|casque/i}).waitFor();
  assert.match(await page.locator('h1').innerText(), /moto|casque/i);
  console.log('QUIZ moto: OK');
  assert.deepEqual(errors, []);
  fs.writeFileSync(dir+'/smoke-report.json',JSON.stringify({passed:true,widths:[360,390,768,1440],routesPerWidth:10,cart:['create','update','reload'],quiz:'moto',errors},null,2));
  console.log('SMOKE PASSED');
} finally { await context.close(); await browser.close(); }
