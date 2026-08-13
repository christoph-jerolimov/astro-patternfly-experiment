# astro-patternfly-experiment

An [Astro](https://astro.build) site whose default page is built with the
[PatternFly React](https://www.patternfly.org) component library.

## Commands

| Command                | Action                                   |
| ---------------------- | ---------------------------------------- |
| `npm install`          | Install dependencies                     |
| `npm run dev`          | Start the dev server at `localhost:4321` |
| `npm run build`        | Build the production site to `./dist/`   |
| `npm run preview`      | Preview the build locally                |
| `npm run check`        | Type-check the Astro and React sources   |
| `npm test`             | Build, then assert on the generated HTML |
| `npm run format`       | Format the sources with Prettier         |
| `npm run format:check` | Fail if anything is not formatted        |
| `npm run screenshots`  | Recapture `screenshots/` in both themes  |

## Project structure

```
src/
├── components/
│   ├── AppLayout.tsx             # masthead + side nav (hydrated island)
│   ├── DashboardActivity.tsx     # recent activity list
│   ├── DashboardStats.tsx        # headline metric cards
│   ├── DashboardUtilization.tsx  # utilization bars
│   ├── EmptyStateGallery.tsx     # the empty-state variants
│   ├── LoginDemo.tsx             # sign-in screen (its own island)
│   ├── FeatureCards.tsx          # static card gallery
│   ├── HeroSection.tsx           # static intro block
│   ├── ResourceLinks.tsx         # static links card
│   ├── ServerDetailTabs.tsx      # detail view tabs (its own island)
│   ├── ServersTable.tsx          # list view (its own island)
│   ├── SettingsForm.tsx          # preferences form (its own island)
│   └── ThemeToggle.tsx           # light/dark switch in the masthead
├── data/
│   └── servers.ts                # sample fleet used by the list view
├── layouts/
│   └── Layout.astro       # document shell, base.css, pre-paint theme script
├── pages/
│   ├── dashboard.astro    # the dashboard demo
│   ├── empty-states.astro # the empty-state demo
│   ├── index.astro        # the default page
│   ├── login.astro        # the sign-in demo, no app chrome
│   ├── servers.astro      # the list view demo
│   ├── settings.astro     # the preferences form demo
│   └── servers/
│       └── detail.astro   # the detail view demo
├── site.ts                # BASE_PATH, shared with astro.config.mjs
└── theme.ts               # dark mode class and storage key

e2e/
├── global-setup.ts        # clears screenshots/, builds and serves the site
├── global-teardown.ts     # stops the preview server
├── preview.ts             # preview server lifecycle
└── screenshots.spec.ts    # Playwright capture of every page in both themes

screenshots/                # committed, regenerate with npm run screenshots
├── dashboard-{light,dark}.png
├── empty-states-{light,dark}.png
├── index-{light,dark}.png
├── login-{light,dark}.png
├── servers-{light,dark}.png
├── settings-{light,dark}.png
└── servers-detail-{light,dark}.png

test/
├── build-output.test.ts   # assertions against the built pages
└── global-setup.ts        # builds the site before the suite runs
```

`AppLayout` carries a `client:load` directive on every page, so the masthead and
side navigation are interactive while the sections below are rendered to plain
HTML at build time. The only other islands are `ServersTable` and
`ServerDetailTabs`, because filtering, sorting and switching tabs cannot be
static.

## Sidebar

The sidebar lists the site's pages, then the sections of whichever page is
open. Pages live in `AppLayout`; each page passes its own `sections` and the
`activeItem` to highlight. Section anchors are per page rather than global,
because an anchor to a section the current page does not have scrolls nowhere.

## Dashboard

`/dashboard/` is a demo built from the same component library: headline metrics,
utilization bars and a recent-activity list, all static HTML apart from the
shared app shell.

The metric cards colour a trend by whether it is **good**, not by its sign — a
falling error rate or latency is an improvement, so tying the colour to the sign
alone would paint every drop red. The arrow follows the direction of the number;
the colour follows what that direction means.

## List view

`/servers/` is a table with filtering, sorting, bulk selection and pagination.
It is the one page whose content genuinely needs the client, so `ServersTable`
carries its own `client:load` and hydrates **nested inside** the app shell
island. Astro supports that: a nested island waits for its parent to hydrate and
then hydrates itself.

The table comes from `@patternfly/react-table`, which is a separate package from
`react-core` and therefore also has to be listed in `vite.resolve.noExternal`.

Filtering clamps the page number rather than leaving the reader on an empty page
when the result set shrinks below the current offset, and an empty state inside
the table body offers to clear the filters.

## Detail view

`/servers/detail/` is where a row leads: a breadcrumb back to the list, a page
header with the status and actions, and tabs for overview, metrics and logs.
The sidebar keeps **Servers** highlighted, since a detail page belongs to its
list.

Only the tabbed area is an island — the breadcrumb and header never change, so
they stay static HTML.

It is a static route rather than `[id].astro` because the screenshot suite skips
dynamic routes: building a URL for one needs parameters. Every row in the list
links here.

## Empty states

`/empty-states/` shows the states a list can be in when it has nothing to show,
side by side. They are worth distinguishing: **no results** is the reader's own
filters, **no data** is an empty account, and **no access** is neither. Showing
the same message for all three sends people looking for the wrong problem.

Each variant pairs the right icon with the right action — retry for a failure,
clear-filters for a filtered-out list, create for an empty account — and the
failure states carry PatternFly's `status` colours.

## Login

`/login/` is deliberately **not** wrapped in `AppLayout`. A sign-in screen has no
navigation to offer yet, so it renders full-bleed without the masthead and
sidebar, and a test asserts neither is present.

That makes it unreachable from the app's own nav, so the sidebar lists it under a
separate **Standalone** group — mixing it in with the app's pages would imply the
chrome stays.

Nothing is authenticated. Submitting shows the error state a real form would,
because an inert login screen that does nothing is the least interesting half of
the component to look at.

## Settings

`/settings/` is form controls outside a wizard: a text input with live
validation, a select, a radio group and switches.

The project name is checked **on every keystroke** rather than only on submit,
so the error state is something you reach by typing rather than by deliberately
saving something invalid, and Save disables itself while the name is invalid.
Turning on maintenance mode reveals a warning that is hidden the rest of the
time.

## Notes on combining Astro and PatternFly

A few things that are specific to this combination:

- **PatternFly must be bundled for SSR.** Its packages import CSS from
  JavaScript. If they stay external during server rendering, Node tries to
  `require()` those stylesheets and the build fails, so they are listed under
  `vite.resolve.noExternal` in `astro.config.mjs`. That has to be the top-level
  `resolve`, not `ssr.noExternal`: Astro 7 prerenders static routes in its own
  Vite environment, which the `ssr` options do not reach.
- **No JSX inside `.astro` expressions.** Astro templates are not JSX, so a
  prop such as `icon={<RocketIcon />}` does not compile. Element-valued props
  live in the `.tsx` components instead.
- **`base.css` has no utility classes.** `@patternfly/react-core/dist/styles/base.css`
  ships the reset, tokens and component styles, but not the `pf-v6-u-*`
  utilities. Spacing here uses PatternFly's layout components (`Stack`, `Flex`,
  `Gallery`) rather than utility classes.
- **Filling the viewport takes `isContentFilled`.** PatternFly's main container
  is sized to its content by default, so `isFilled` on a `PageSection` is not
  enough on its own; `Page` needs `isContentFilled` for the section to have room
  to grow into.

## Dark mode

PatternFly v6 redefines its design tokens under `:root:where(.pf-v6-theme-dark)`,
so switching themes means toggling one class on the document element. Three
pieces make that work:

- `src/theme.ts` holds the class name, the `localStorage` key and the helpers.
- An inline script in `Layout.astro` applies the theme **before the body is
  parsed**, which is what stops the page flashing the wrong theme on load. It
  has to be dependency-free to run that early, so it repeats the few lines of
  logic rather than importing them; the values it depends on are passed in from
  `theme.ts` via `define:vars`, so they cannot drift.
- `ThemeToggle` in the masthead switches and remembers the choice.

Without an explicit choice the site follows `prefers-color-scheme` and reacts to
the OS changing it. Once the visitor uses the toggle, their choice wins.

## Screenshots

`npm run screenshots` runs the Playwright test in `e2e/`, which captures every
page in both themes into `screenshots/` as `<page>-light.png` and
`<page>-dark.png`. Global setup builds the site and serves it with
`astro preview` first, so the command needs no setup.

The preview server is started from global setup rather than through Playwright's
`webServer`, because `astro preview` always detaches into a background daemon and
returns immediately — Playwright reads that exit as "the server died" and fails
the run. Global teardown stops the daemon, so no server is left holding the port.

The two themes are two Playwright **projects** differing only in `colorScheme`.
That picks the theme through Chromium's `prefers-color-scheme` rather than by
clicking the toggle: a fresh browser context has no stored choice, so the
pre-paint script lands on the right theme with nothing to click and nothing to
wait for.

Routes are read from `src/pages`, not from `dist/`, because Playwright collects
tests before global setup has built the site. New pages are picked up
automatically; dynamic routes (`[slug].astro`) are skipped, since building a URL
for them needs parameters.

The test captures rather than compares — it uses `page.screenshot()`, not
`toHaveScreenshot()`, so it never fails on a rendering difference.

The images are committed, so a diff shows how a change affects the rendered page.
CI does not run this suite — font rendering differs between machines, so
regenerated images would differ for reasons unrelated to the change.
**Rerun the command by hand when a change affects the page.**

If the environment already ships a browser, point at it with
`CHROMIUM_PATH=/path/to/chromium npm run screenshots` instead of running
`npx playwright install chromium`.

## Continuous integration and deployment

- `.github/workflows/ci.yml` runs the formatting check, the type check, the
  build and the tests on every push and pull request.
- `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push
  to `main`. It needs **Settings → Pages → Build and deployment → Source** set
  to **GitHub Actions** once, after which the site is served from
  `https://christoph-jerolimov.github.io/astro-patternfly-experiment`.

### Base path

A GitHub Pages project site is served from a subdirectory, not the domain root,
so `src/site.ts` exports `BASE_PATH` and `astro.config.mjs` uses it as `base`.
Site-local links go through the `withBase()` helper from the same module —
writing `/logo.svg` directly would resolve outside the deployed site.

`BASE_PATH` is a plain constant rather than `import.meta.env.BASE_URL`: Vite
inlines that value at transform time, and it does not resolve consistently
across the SSR build, the client bundle and the test runner. Deploying to a
domain root means setting `BASE_PATH` to `''` and `site` to that domain.

If a local build ever emits unprefixed URLs after `BASE_PATH` changes, clear the
stale Vite cache with `rm -rf dist .astro node_modules/.vite`. CI always builds
from a clean checkout, so it is not affected.
