import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
async function prepare(page:Page){
 await page.goto('/work/della');await page.evaluate(()=>document.fonts.ready);
 for(const img of await page.locator('main img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate((el:HTMLImageElement)=>el.decode());}
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
}
test('the original call evidence and the revised opening on desktop',async({page},info)=>{
 await prepare(page);await expect(page).toHaveScreenshot('originals-opening.png',{animations:'disabled'});
 await expect(page.getByTestId('real-call-screens')).toHaveScreenshot('originals-call-evidence.png',{animations:'disabled'});
 await expect(page.locator('#memory')).toHaveScreenshot('originals-memory.png',{animations:'disabled'});
 await expect(page.getByTestId('inbox-record')).toHaveScreenshot('originals-inbox.png',{animations:'disabled'});
 mkdirSync('qa/della-originals',{recursive:true});await page.screenshot({path:`qa/della-originals/full-${info.project.name}.png`,fullPage:true,animations:'disabled'});
});
test('original screenshot crops remain readable on a phone',async({page})=>{
 await page.setViewportSize({width:390,height:844});await prepare(page);
 await expect(page).toHaveScreenshot('originals-phone-opening.png',{animations:'disabled'});
 await expect(page.getByTestId('call-record')).toHaveScreenshot('originals-phone-call.png',{animations:'disabled'});
 await expect(page.getByTestId('inbox-record')).toHaveScreenshot('originals-phone-inbox.png',{animations:'disabled'});
});
