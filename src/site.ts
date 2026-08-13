/**
 * Path the site is served from, without a trailing slash. GitHub Pages serves
 * a project site from https://<owner>.github.io/<repo>, so the site is not at
 * the domain root. Set this to '' when deploying to a domain root.
 *
 * `astro.config.mjs` imports this as its `base`, so the config and the links
 * below can never drift apart. It is a plain constant rather than
 * `import.meta.env.BASE_URL` because that value is inlined by Vite at
 * transform time and does not resolve consistently across the SSR build, the
 * client bundle and the test runner.
 */
export const BASE_PATH = '/astro-patternfly-experiment';

/** Prefixes a root-relative path with {@link BASE_PATH}. */
export function withBase(path: string): string {
  return `${BASE_PATH}/${path.replace(/^\//, '')}`;
}
