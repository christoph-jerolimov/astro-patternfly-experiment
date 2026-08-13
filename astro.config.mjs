// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
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
