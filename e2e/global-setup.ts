import { rm } from 'node:fs/promises';
import type { FullConfig } from '@playwright/test';

import { startPreview } from './preview';

/**
 * Clears the screenshot folder so deleting a page also removes its images
 * instead of leaving them behind forever, then builds and serves the site.
 * Cleaning from a test would race the workers capturing in parallel.
 */
export default async function globalSetup(config: FullConfig) {
  await rm(new URL('../screenshots/', import.meta.url), { recursive: true, force: true });
  await startPreview(config.projects[0].use.baseURL!);
}
