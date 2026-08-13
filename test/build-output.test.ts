import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';

import { BASE_PATH } from '../src/site';

const base = BASE_PATH.replace(/\/$/, '');
const distDir = new URL('../dist/', import.meta.url);

let html: string;

beforeAll(async () => {
  html = await readFile(new URL('index.html', distDir), 'utf8');
});

describe('page shell', () => {
  it('server-renders the PatternFly page scaffolding', () => {
    expect(html).toContain('pf-v6-c-page');
    expect(html).toContain('pf-v6-c-masthead');
    expect(html).toContain('pf-v6-c-page__sidebar');
  });

  it('renders every navigation item', () => {
    for (const label of ['Overview', 'Components', 'Islands', 'Resources']) {
      expect(html).toContain(`>${label}<`);
    }
  });

  it('lets the main container fill the viewport', () => {
    // Page's isContentFilled prop. Without it the content area stops short of
    // the bottom of the page.
    expect(html).toContain('pf-v6-c-page__main-container pf-m-fill');
  });

  it('links a stylesheet so PatternFly is actually styled', () => {
    expect(html).toMatch(/<link rel="stylesheet" href="[^"]+\.css">/);
  });
});

describe('page content', () => {
  it('renders one card per feature plus the resources card', () => {
    expect(html.match(/pf-v6-c-card /g)).toHaveLength(5);
  });

  it('renders the hero heading', () => {
    expect(html).toContain('Astro, with PatternFly React');
  });

  it('uses PatternFly layout components rather than pf-v6-u-* utilities', () => {
    // base.css ships no utility classes, so they would silently do nothing.
    expect(html).not.toMatch(/class="[^"]*pf-v6-u-/);
    expect(html).toContain('pf-v6-l-stack');
    expect(html).toContain('pf-v6-l-gallery');
  });

  it('opens external links safely', () => {
    const links = html.match(/<a [^>]*href="https:\/\/[^"]*"[^>]*>/g) ?? [];
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      expect(link).toContain('rel="noreferrer"');
      expect(link).toContain('target="_blank"');
    }
  });
});

describe('base path handling', () => {
  it('prefixes site-local asset URLs', () => {
    expect(html).toContain(`href="${base}/favicon.svg"`);
    expect(html).toContain(`src="${base}/logo.svg"`);
  });

  it('prefixes the bundled assets', () => {
    expect(html).toMatch(new RegExp(`href="${base}/_astro/[^"]+\\.css"`));
  });

  it('never emits a root-relative URL that would escape the base path', () => {
    const urls = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith(`${base}/`)).toBe(true);
    }
  });
});

describe('hydration', () => {
  it('ships the app shell as a client island', () => {
    expect(html).toContain('<astro-island');
    expect(html).toContain('client="load"');
  });
});
