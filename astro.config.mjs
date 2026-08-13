// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import { BASE_PATH } from './src/site.ts';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages serves a project site from https://<owner>.github.io/<repo>,
  // so the build needs to know it is not hosted at the domain root. Change
  // BASE_PATH to '' (and `site` to the domain) when using a custom domain.
  site: 'https://christoph-jerolimov.github.io',
  base: BASE_PATH,
  integrations: [react()],
  vite: {
    ssr: {
      // PatternFly's packages import CSS from JavaScript. If they stay external
      // during SSR, Node tries to `require()` those stylesheets and fails, so
      // let Vite bundle and process them instead.
      noExternal: [
        '@patternfly/react-core',
        '@patternfly/react-icons',
        '@patternfly/react-styles',
        '@patternfly/react-tokens',
      ],
    },
  },
});
