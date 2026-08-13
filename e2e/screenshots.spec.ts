import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const pagesDir = new URL('../src/pages/', import.meta.url);
const screenshotsDir = new URL('../screenshots/', import.meta.url);

interface Route {
  /** Path to visit, relative to the configured baseURL. */
  path: string;
  /** Screenshot file name, without the theme suffix. */
  name: string;
}

/**
 * Lists the site's routes.
 *
 * Read from src/pages rather than from dist/ because Playwright collects tests
 * before the webServer has built the site, so dist/ may not exist yet.
 */
function findRoutes(dir = pagesDir, prefix = ''): Route[] {
  const routes: Route[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    // Dynamic routes need parameters to build a URL, and files prefixed with an
    // underscore are not routes at all.
    if (entry.name.startsWith('_') || entry.name.includes('[')) continue;

    if (entry.isDirectory()) {
      routes.push(...findRoutes(new URL(`${entry.name}/`, dir), `${prefix}${entry.name}/`));
      continue;
    }

    const match = entry.name.match(/^(.*)\.(astro|md|mdx)$/);
    if (!match) continue;

    const segment = match[1] === 'index' ? '' : `${match[1]}/`;
    const path = `${prefix}${segment}`;
    routes.push({
      path,
      name: path === '' ? 'index' : path.replace(/\/$/, '').replace(/\//g, '-'),
    });
  }

  return routes;
}

const routes = findRoutes();

test.describe('screenshots', () => {
  for (const route of routes) {
    test(route.name, async ({ page }, testInfo) => {
      const response = await page.goto(route.path);
      expect(response?.ok(), `${route.path} should be served`).toBe(true);

      // Web fonts shift the layout, so let them settle before capturing.
      await page.evaluate(() => document.fonts.ready);

      // PatternFly's Page scrolls its main region rather than the document, so
      // the document never grows past the viewport and `fullPage` would cut a
      // tall page off at the fold. Grow the viewport to the hidden height so the
      // whole page is captured.
      const hidden = await page.evaluate(() => {
        const main = document.querySelector('#main-content');
        return main ? main.scrollHeight - main.clientHeight : 0;
      });
      if (hidden > 0) {
        const viewport = page.viewportSize()!;
        await page.setViewportSize({ width: viewport.width, height: viewport.height + hidden });
        await page.evaluate(() => document.fonts.ready);
      }

      const file = new URL(`${route.name}-${testInfo.project.name}.png`, screenshotsDir);
      await page.screenshot({
        path: fileURLToPath(file),
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
