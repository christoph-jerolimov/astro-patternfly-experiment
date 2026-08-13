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

## Project structure

```
src/
├── components/
│   ├── AppLayout.tsx      # masthead + collapsible side nav (hydrated island)
│   ├── FeatureCards.tsx   # static card gallery
│   ├── HeroSection.tsx    # static intro block
│   └── ResourceLinks.tsx  # static links card
├── layouts/
│   └── Layout.astro       # document shell, imports PatternFly's base.css
├── pages/
│   └── index.astro        # the default page
└── site.ts                # BASE_PATH, shared with astro.config.mjs

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
  `vite.ssr.noExternal` in `astro.config.mjs`.
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
