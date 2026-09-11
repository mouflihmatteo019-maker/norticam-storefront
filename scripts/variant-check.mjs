import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'chrome'});
const page=await browser.newPage({viewport:{width:390,height:844}});
try {
 await page.goto((process.env.TEST_URL || 'http://127.0.0.1:4180')+'/produits/dashcam-voiture-360-4k/');
 await page.waitForSelector('[data-catalog-ready="true"]');
 const selects=page.locator('fieldset select');
 assert.ok(await selects.count()>0,'Grouped variant selector visible');
 const first=selects.first();
 const options=await first.locator('option:not([disabled])').evaluateAll(nodes=>nodes.map(n=>n.value));
 if(options.length>1){await first.selectOption(options[1]);assert.equal(await first.inputValue(),options[1]);}
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile overflow');
 fs.mkdirSync('test-results',{recursive:true});
 await page.screenshot({path:'test-results/product-mobile-final.png',fullPage:true});
 const products=Array.from(fs.readFileSync('dist/public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)).map(m=>new URL(m[1]).pathname).filter(p=>p.startsWith('/produits/'));
 for(const route of products){await page.goto((process.env.TEST_URL || 'http://127.0.0.1:4180')+route);await page.waitForSelector('[data-catalog-ready="true"]');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' mobile overflow');}
 console.log('Variant options and mobile layout: passed');
} finally {await browser.close();}
