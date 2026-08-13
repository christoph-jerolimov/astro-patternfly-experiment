import { defineConfig } from '@playwright/test';

import { PREVIEW_PORT } from './e2e/preview';
import { BASE_PATH } from './src/site';

const baseURL = `http://localhost:${PREVIEW_PORT}${BASE_PATH}/`;

export default defineConfig({
  testDir: './e2e',
  // Kept out of ./test so this does not collect the Vitest suite, whose files
  // also end in .test.ts.
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    viewport: { width: 1280, height: 900 },
    // CHROMIUM_PATH lets an environment that already ships a browser point at
    // it instead of installing Playwright's own.
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
  },
  // One project per theme. The site follows prefers-color-scheme until the
  // visitor picks a theme, so a fresh context lands on the right one with
  // nothing to click and nothing to wait for.
  projects: [
    { name: 'light', use: { colorScheme: 'light' } },
    { name: 'dark', use: { colorScheme: 'dark' } },
  ],
});
