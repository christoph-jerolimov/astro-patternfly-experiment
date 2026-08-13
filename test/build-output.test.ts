import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';

import { BASE_PATH } from '../src/site';
import { DARK_CLASS, STORAGE_KEY } from '../src/theme';

const base = BASE_PATH.replace(/\/$/, '');
const distDir = new URL('../dist/', import.meta.url);

let html: string;
let dashboard: string;

beforeAll(async () => {
  html = await readFile(new URL('index.html', distDir), 'utf8');
  dashboard = await readFile(new URL('dashboard/index.html', distDir), 'utf8');
});

describe('page shell', () => {
  it('server-renders the PatternFly page scaffolding', () => {
    expect(html).toContain('pf-v6-c-page');
    expect(html).toContain('pf-v6-c-masthead');
    expect(html).toContain('pf-v6-c-page__sidebar');
  });

  it('links to every page from the sidebar, base-prefixed', () => {
    expect(html).toContain(`href="${base}/"`);
    expect(html).toContain(`href="${base}/dashboard/"`);
    for (const label of ['Overview', 'Dashboard']) {
      expect(html).toContain(`>${label}<`);
    }
  });

  it('marks the current page as the active nav item', () => {
    // The sidebar highlights whichever page is being served, so the two pages
    // must not agree on which item is current.
    const current = (page: string) =>
      page.match(/pf-v6-c-nav__link pf-m-current"[^>]*>\s*<span[^>]*>([^<]+)</)?.[1];
    expect(current(html)).toBe('Overview');
    expect(current(dashboard)).toBe('Dashboard');
  });

  it('lists the sections of the page being served', () => {
    for (const label of ['Features', 'Resources']) {
      expect(html).toContain(`>${label}<`);
    }
    for (const label of ['Metrics', 'Utilization', 'Activity']) {
      expect(dashboard).toContain(`>${label}<`);
    }
    // Section anchors are per page; the overview's must not leak onto the
    // dashboard, where they would scroll nowhere.
    expect(dashboard).not.toContain('href="#features"');
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

describe('dashboard', () => {
  it('server-renders the stat cards, utilization bars and activity list', () => {
    for (const label of ['Requests', 'p95 latency', 'Error rate', 'Builds today']) {
      expect(dashboard).toContain(label);
    }
    expect(dashboard).toContain('pf-v6-c-progress');
    expect(dashboard).toContain('pf-v6-c-data-list');
  });

  it('anchors every section the sidebar links to', () => {
    for (const id of ['metrics', 'utilization', 'activity']) {
      expect(dashboard).toContain(`href="#${id}"`);
      expect(dashboard).toMatch(new RegExp(`id="${id}"`));
    }
  });

  it('colours a trend by whether it is good, not by its sign', () => {
    // Latency is down 8.1% and the error rate is up 0.8%. Both must not be read
    // off the sign alone: falling latency is an improvement, while rising
    // errors are a regression even though the number went up.
    // Split on the marker PatternFly puts on each card root, so a chunk is one
    // whole card rather than an inner card__title or card__body element.
    const card = (label: string) =>
      dashboard
        .split('data-ouia-component-type="PF6/Card"')
        .find((chunk) => chunk.includes(label)) ?? '';
    expect(card('p95 latency')).toContain('pf-m-green');
    expect(card('Error rate')).toContain('pf-m-red');
  });

  it('warns on the resources that are running out', () => {
    // Storage is at 91% and memory at 78%, so one bar is red and one amber.
    expect(dashboard).toContain('pf-m-danger');
    expect(dashboard).toContain('pf-m-warning');
  });
});

describe('dark mode', () => {
  it('declares support for both color schemes', () => {
    expect(html).toContain('<meta name="color-scheme" content="light dark">');
  });

  it('applies the theme before the body is parsed', () => {
    // A theme applied after first paint shows up as a flash of the wrong one.
    const script = html.indexOf(DARK_CLASS);
    expect(script).toBeGreaterThan(-1);
    expect(script).toBeLessThan(html.indexOf('<body'));
  });

  it('inlines the bootstrap script rather than fetching it', () => {
    // An external script would be a render-blocking round trip in the head.
    const head = html.slice(0, html.indexOf('</head>'));
    expect(head).toContain(STORAGE_KEY);
    expect(head).toContain('prefers-color-scheme: dark');
    expect(head).not.toMatch(/<script[^>]*\ssrc=/);
  });

  it('server-renders the theme toggle', () => {
    expect(html).toMatch(/aria-label="Switch to the (light|dark) theme"/);
  });
});

describe('hydration', () => {
  it('ships the app shell as a client island', () => {
    expect(html).toContain('<astro-island');
    expect(html).toContain('client="load"');
  });
});
