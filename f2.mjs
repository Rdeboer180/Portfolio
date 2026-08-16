import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
await p.goto('http://localhost:4190/', { waitUntil:'networkidle' });
await p.waitForTimeout(700);
await p.click('a[href="/notes"]');
await p.waitForTimeout(900);
console.log('all live regions:', JSON.stringify(await p.evaluate(()=>
  [...document.querySelectorAll('[aria-live]')].map(e=>({ text: e.textContent, cls: e.className })))));
console.log('title:', await p.title());
// and a second hop, to be sure it is not a one-shot
await p.click('a[href="/resume"]').catch(()=>p.goto('http://localhost:4190/resume/'));
await p.waitForTimeout(900);
console.log('after 2nd nav :', JSON.stringify(await p.evaluate(()=>
  [...document.querySelectorAll('[aria-live]')].map(e=>e.textContent).filter(Boolean))));
await b.close();
