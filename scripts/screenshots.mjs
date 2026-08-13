/**
 * Captures a light and a dark screenshot of every page in the built site.
 *
 * Run with `npm run screenshots`. The images land in screenshots/<theme>/ and
 * are committed, so a diff shows how a change affects the rendered page.
 *
 * Themes are selected through Chromium's prefers-color-scheme rather than by
 * clicking the toggle: the pre-paint script in Layout.astro follows the OS
 * preference when the visitor has not chosen a theme, so a fresh browser
 * context lands on the right theme with nothing to click and nothing to wait
 * for.
 */
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { BASE_PATH } from '../src/site.ts';

const root = new URL('..', import.meta.url);
const distDir = new URL('dist/', root);
const outDir = new URL('screenshots/', root);

const THEMES = /** @type {const} */ (['light', 'dark']);
const VIEWPORT = { width: 1280, height: 900 };

/** Returns every built page as a site-relative route, e.g. '' or 'about'. */
async function findPages(dir = distDir, prefix = '') {
  const pages = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === '_astro') continue;
      pages.push(...(await findPages(new URL(`${entry.name}/`, dir), `${prefix}${entry.name}/`)));
    } else if (entry.name === 'index.html') {
      pages.push(prefix);
    }
  }
  return pages.sort();
}

/** Terminates the preview server and everything it spawned. */
function stop(server) {
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    // Already gone.
  }
}

/**
 * Starts `astro preview`, which serves dist/ under BASE_PATH the same way
 * GitHub Pages hosts it. Readiness is decided by polling the server rather than
 * by parsing its banner, which is not a stable interface.
 */
async function serve(port, url) {
  // detached puts the server in its own process group. npx spawns astro through
  // a shell, so killing the npx process alone would orphan the actual server and
  // leave the port taken; killing the group takes the whole chain down.
  const server = spawn('npx', ['astro', 'preview', '--port', String(port)], {
    cwd: fileURLToPath(root),
    stdio: 'ignore',
    detached: true,
  });
  let exited = null;
  server.on('exit', (code) => (exited = code));

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (exited !== null) throw new Error(`astro preview exited with ${exited}`);
    try {
      const response = await fetch(url);
      if (response.ok) return server;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  stop(server);
  throw new Error(`astro preview was not reachable at ${url} within 30s`);
}

console.log('Building the site...');
execFileSync('npm', ['run', 'build'], { cwd: fileURLToPath(root), stdio: 'inherit' });

const pages = await findPages();
console.log(`Capturing ${pages.length} page(s) in ${THEMES.length} themes.`);

const port = 4327;
const origin = `http://localhost:${port}`;
const server = await serve(port, `${origin}${BASE_PATH}/`);

try {
  // CHROMIUM_PATH lets an environment that already ships a browser point at it
  // instead of downloading one. Unset, Playwright uses its own install.
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

  try {
    await rm(outDir, { recursive: true, force: true });

    for (const theme of THEMES) {
      await mkdir(new URL(`${theme}/`, outDir), { recursive: true });
      const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: theme });
      const page = await context.newPage();

      for (const route of pages) {
        const url = `${origin}${BASE_PATH}/${route}`;
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        if (!response?.ok()) {
          throw new Error(`${url} returned ${response?.status()}`);
        }
        // Web fonts shift the layout, so let them settle before capturing.
        await page.evaluate(() => document.fonts.ready);

        const name = route === '' ? 'index' : route.replace(/\/$/, '').replace(/\//g, '-');
        const file = new URL(`${theme}/${name}.png`, outDir);
        await page.screenshot({
          path: fileURLToPath(file),
          fullPage: true,
          animations: 'disabled',
        });
        console.log(`  ${theme}/${name}.png`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  stop(server);
}

console.log('Done.');
