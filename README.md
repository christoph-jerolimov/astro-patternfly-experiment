# astro-patternfly-experiment

An [Astro](https://astro.build) site whose default page is built with the
[PatternFly React](https://www.patternfly.org) component library.

## Commands

| Command           | Action                                        |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at `localhost:4321`      |
| `npm run build`   | Build the production site to `./dist/`        |
| `npm run preview` | Preview the build locally                     |
| `npm run check`   | Type-check the Astro and React sources        |

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
└── pages/
    └── index.astro        # the default page
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
- **`<astro-slot>` needs `display: contents`.** Astro wraps content slotted into
  an island in an `<astro-slot>` element. Left as an inline box it becomes a
  flex item inside PatternFly's page main region and breaks the layout, so
  `Layout.astro` takes it out of the box tree.
