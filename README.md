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
│   ├── AppLayout.tsx      # masthead + collapsible side nav (hydrated island)
│   ├── FeatureCards.tsx   # static card gallery
│   ├── HeroSection.tsx    # static intro block
│   ├── ResourceLinks.tsx  # static links card
│   └── ThemeToggle.tsx    # light/dark switch in the masthead
├── layouts/
│   └── Layout.astro       # document shell, base.css, pre-paint theme script
├── pages/
│   └── index.astro        # the default page
├── site.ts                # BASE_PATH, shared with astro.config.mjs
└── theme.ts               # dark mode class and storage key

e2e/
├── global-setup.ts        # clears screenshots/, builds and serves the site
├── global-teardown.ts     # stops the preview server
├── preview.ts             # preview server lifecycle
└── screenshots.spec.ts    # Playwright capture of every page in both themes

screenshots/
├── index-light.png        # committed, regenerate with npm run screenshots
└── index-dark.png

test/
├── build-output.test.ts   # assertions against dist/index.html
└── global-setup.ts        # builds the site before the suite runs
```

`AppLayout` is the only component with a `client:load` directive, so the
masthead and side navigation are interactive while every other section is
rendered to plain HTML at build time.

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
