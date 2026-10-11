import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

test('all character and stage controls remain inside the lab at narrow widths', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/transformer');
    const lab=page.getByTestId('transformer-lab');
    await expect(lab).toHaveAttribute('data-reduced','true');
    await page.evaluate(()=>document.fonts.ready);
    const bounds=await lab.boundingBox();
    expect(bounds).not.toBeNull();
    for (const control of await lab.locator('fieldset label, [role="group"] button').all()) {
      const box=await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(box!.x+box!.width).toBeLessThanOrEqual(bounds!.x+bounds!.width+1);
    }
    await page.getByRole('radio',{name:': at position 6',exact:true}).check();
    await expect(lab).toHaveAttribute('data-position','5');
    await page.getByRole('group',{name:'Follow the computation'}).getByRole('button',{name:/Prediction/}).click();
    await expect(lab).toHaveAttribute('data-stage','Prediction');
    mkdirSync('qa',{recursive:true});
    await lab.screenshot({path:`qa/settled-lab-${width}-${info.project.name}.png`,animations:'disabled'});
  }
});
