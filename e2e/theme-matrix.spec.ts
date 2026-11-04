import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

import { MODIFIERS, MODIFIERS_STORAGE_KEY, STORAGE_KEY } from '../src/theme';

const screenshotsDir = new URL('../screenshots/', import.meta.url);

/**
 * Pages captured for every theme modifier.
 *
 * Not the whole site: the full page set is already captured in light and dark
 * by screenshots.spec.ts, and multiplying 13 pages by every modifier would
 * commit a hundred images to show the same two things. These two cover it —
 * the dashboard for the app chrome, cards and status colours, and controls for
 * the borders and affordances that high contrast actually changes.
 */
const PAGES = [
  { path: 'dashboard/', name: 'dashboard' },
  { path: 'controls/', name: 'controls' },
];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme });

    for (const modifier of MODIFIERS) {
      for (const route of PAGES) {
        test(`${route.name}-${scheme}-${modifier.id}`, async ({ page }) => {
          // Seed the stored choice rather than toggling classes by hand, so the
          // capture goes through the same pre-paint path a visitor would.
          await page.addInitScript(
            ([modeKey, mode, modifiersKey, value]) => {
              localStorage.setItem(modeKey, mode);
              localStorage.setItem(modifiersKey, value);
            },
            [STORAGE_KEY, scheme, MODIFIERS_STORAGE_KEY, modifier.id] as const,
          );

          const response = await page.goto(route.path);
          expect(response?.ok(), `${route.path} should be served`).toBe(true);

          const applied = await page.evaluate(() =>
            [...document.documentElement.classList].filter((c) => c.startsWith('pf-v6-theme-')),
          );
          expect(applied).toContain(`pf-v6-theme-${modifier.id}`);
          if (scheme === 'dark') expect(applied).toContain('pf-v6-theme-dark');

          await page.evaluate(() => document.fonts.ready);

          // Same reason as screenshots.spec.ts: PatternFly scrolls its main
          // region, not the document, so fullPage alone stops at the fold.
          const hidden = await page.evaluate(() => {
            const main = document.querySelector('#main-content');
            return main ? main.scrollHeight - main.clientHeight : 0;
          });
          if (hidden > 0) {
            const viewport = page.viewportSize()!;
            await page.setViewportSize({
              width: viewport.width,
              height: viewport.height + hidden,
            });
            await page.evaluate(() => document.fonts.ready);
          }

          await page.screenshot({
            path: fileURLToPath(
              new URL(`${route.name}-${scheme}-${modifier.id}.png`, screenshotsDir),
            ),
            fullPage: true,
            animations: 'disabled',
          });
        });
      }
    }
  });
}
