import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';

import { BASE_PATH } from '../src/site';
import { DARK_CLASS, STORAGE_KEY } from '../src/theme';

const base = BASE_PATH.replace(/\/$/, '');
const distDir = new URL('../dist/', import.meta.url);

let html: string;
let dashboard: string;
let serversPage: string;
let detail: string;
let emptyStates: string;
let login: string;
let settings: string;
let notFound: string;
let forbidden: string;
let serverError: string;
let foundations: string;

beforeAll(async () => {
  html = await readFile(new URL('index.html', distDir), 'utf8');
  dashboard = await readFile(new URL('dashboard/index.html', distDir), 'utf8');
  serversPage = await readFile(new URL('servers/index.html', distDir), 'utf8');
  detail = await readFile(new URL('servers/detail/index.html', distDir), 'utf8');
  emptyStates = await readFile(new URL('empty-states/index.html', distDir), 'utf8');
  login = await readFile(new URL('login/index.html', distDir), 'utf8');
  settings = await readFile(new URL('settings/index.html', distDir), 'utf8');
  // Astro reserves 404 and 500, building them to the site root rather than to
  // directories like every other page.
  notFound = await readFile(new URL('404.html', distDir), 'utf8');
  forbidden = await readFile(new URL('403/index.html', distDir), 'utf8');
  serverError = await readFile(new URL('500.html', distDir), 'utf8');
  foundations = await readFile(new URL('foundations/index.html', distDir), 'utf8');
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

describe('servers list view', () => {
  it('server-renders the table with its toolbar', () => {
    expect(serversPage).toContain('pf-v6-c-table');
    expect(serversPage).toContain('pf-v6-c-toolbar');
    for (const column of ['Name', 'Status', 'Region', 'CPU', 'Memory']) {
      expect(serversPage).toContain(`>${column}<`);
    }
  });

  it('renders only the first page of rows', () => {
    // 8 servers at 5 per page, so the initial render must not dump them all.
    const rows = serversPage.match(/data-label="Name"/g) ?? [];
    expect(rows).toHaveLength(5);
    expect(serversPage).toContain('api-gateway');
    expect(serversPage).not.toContain('worker-7c9f');
  });

  it('ships the table as a second island so it can filter and sort', () => {
    // Static HTML cannot filter; the table is nested inside the shell island
    // and has to hydrate on its own.
    const islands = serversPage.match(/<astro-island/g) ?? [];
    expect(islands.length).toBe(2);
  });

  it('links rows to the detail view', () => {
    expect(serversPage).toContain(`href="${base}/servers/detail/"`);
  });
});

describe('server detail view', () => {
  it('renders a breadcrumb back to the list', () => {
    expect(detail).toContain('pf-v6-c-breadcrumb');
    expect(detail).toContain(`href="${base}/servers/"`);
    expect(detail).toContain('worker-7c9f');
  });

  it('renders all three tabs and the overview details', () => {
    expect(detail).toContain('pf-v6-c-tabs');
    for (const tab of ['Overview', 'Metrics', 'Logs']) {
      expect(detail).toContain(`>${tab}<`);
    }
    expect(detail).toContain('pf-v6-c-description-list');
  });

  it('keeps Servers highlighted in the sidebar', () => {
    // A detail page belongs to its list, so the sidebar must not lose the
    // section the reader is in.
    const current = detail.match(
      /pf-v6-c-nav__link pf-m-current"[^>]*>\s*<span[^>]*>([^<]+)</,
    )?.[1];
    expect(current).toBe('Servers');
  });

  it('only hydrates the tabbed area, not the header above it', () => {
    // The breadcrumb and page header never change, so they stay static.
    const islands = detail.match(/<astro-island/g) ?? [];
    expect(islands.length).toBe(2);
  });
});

describe('empty states', () => {
  it('renders one card per state', () => {
    const cards = emptyStates.match(/pf-v6-c-empty-state\b/g) ?? [];
    expect(cards).toHaveLength(6);
  });

  it('distinguishes the states rather than repeating one message', () => {
    // The whole point of the page: no-results, no-data and no-access are
    // different problems and must not share a message.
    for (const title of [
      'No servers yet',
      'No results found',
      'You do not have access',
      'Unable to load servers',
    ]) {
      expect(emptyStates).toContain(title);
    }
  });

  it('carries the status colours through to the failure states', () => {
    expect(emptyStates).toContain('pf-m-danger');
    expect(emptyStates).toContain('pf-m-warning');
  });

  it('stays static apart from the app shell', () => {
    // Nothing here needs the client.
    const islands = emptyStates.match(/<astro-island/g) ?? [];
    expect(islands.length).toBe(1);
  });
});

describe('login', () => {
  it('renders the login page and its form', () => {
    expect(login).toContain('pf-v6-c-login');
    expect(login).toContain('Log in to your account');
    expect(login).toContain('Username');
    expect(login).toContain('Password');
  });

  it('renders without the app chrome', () => {
    // A sign-in screen has no navigation to offer yet, so the masthead and
    // sidebar must not be there.
    expect(login).not.toContain('pf-v6-c-masthead');
    expect(login).not.toContain('pf-v6-c-page__sidebar');
  });

  it('is still reachable from the sidebar of the pages that have one', () => {
    expect(html).toContain(`href="${base}/login/"`);
  });

  it('keeps its brand image inside the base path', () => {
    expect(login).toContain(`src="${base}/logo.svg"`);
  });
});

describe('settings', () => {
  it('renders the form controls', () => {
    expect(settings).toContain('pf-v6-c-form');
    expect(settings).toContain('pf-v6-c-form-control');
    expect(settings).toContain('pf-v6-c-switch');
    expect(settings).toContain('pf-v6-c-radio');
  });

  it('starts valid, so the error state is something you reach by typing', () => {
    // The name is checked on every keystroke rather than only on submit.
    expect(settings).toContain('Lowercase letters, numbers and dashes.');
    expect(settings).not.toContain('Only lowercase letters');
  });

  it('hides the conditional warning until maintenance mode is on', () => {
    expect(settings).not.toContain('routes all traffic to the status page');
  });

  it('offers every region as a select option', () => {
    for (const region of ['eu-central-1', 'us-east-1', 'ap-south-1', 'eu-west-2']) {
      expect(settings).toContain(region);
    }
  });
});

describe('error pages', () => {
  it('says something different for each code', () => {
    expect(notFound).toContain('Page not found');
    expect(forbidden).toContain('You do not have access');
    expect(serverError).toContain('Something went wrong');
  });

  it('shows the code as well as the sentence', () => {
    // "Page not found" alone leaves people guessing whether they mistyped the
    // address or the server is broken.
    expect(notFound).toContain('Error 404');
    expect(forbidden).toContain('Error 403');
    expect(serverError).toContain('Error 500');
  });

  it('keeps the navigation, unlike the login page', () => {
    // Losing the navigation is the last thing someone already lost needs.
    for (const page of [notFound, forbidden, serverError]) {
      expect(page).toContain('pf-v6-c-masthead');
      expect(page).toContain('pf-v6-c-page__sidebar');
    }
  });

  it('offers a way out that stays inside the base path', () => {
    expect(notFound).toContain(`href="${base}/"`);
    expect(notFound).toContain(`href="${base}/servers/"`);
  });

  it('links the reserved pages by file rather than as directories', () => {
    // /404/ and /500/ do not exist; Astro emits them at the site root.
    expect(html).toContain(`href="${base}/404.html"`);
    expect(html).toContain(`href="${base}/500.html"`);
    expect(html).not.toContain(`href="${base}/404/"`);
  });
});

describe('foundations', () => {
  it('shows the type scale and body copy', () => {
    for (const size of ['Title 4xl', 'Title 3xl', 'Title md']) {
      expect(foundations).toContain(size);
    }
    expect(foundations).toContain('<blockquote>');
    expect(foundations).toContain('<pre>');
  });

  it('paints swatches with the token variable, not its baked value', () => {
    // @patternfly/react-tokens carries the light theme's value, so a swatch
    // painted with it would stay light in dark mode. var() recolours.
    expect(foundations).toMatch(/background:\s*var\(--pf-t--global--color--brand--default\)/);
    expect(foundations).toContain('var(--pf-t--global--background--color--primary--default)');
  });

  it('never hardcodes a token value as a colour', () => {
    const swatchStyles = foundations.match(/background:\s*[^;"]+/g) ?? [];
    expect(swatchStyles.length).toBeGreaterThan(0);
    for (const style of swatchStyles) {
      expect(style).toContain('var(--pf-t--');
    }
  });

  it('labels each swatch with its CSS variable name', () => {
    for (const name of [
      '--pf-t--global--color--brand--default',
      '--pf-t--global--text--color--regular',
      '--pf-t--global--border--color--default',
    ]) {
      expect(foundations).toContain(name);
    }
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
