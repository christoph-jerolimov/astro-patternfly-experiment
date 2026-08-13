import { rm } from 'node:fs/promises';

/**
 * Clears the screenshot folder before the suite runs, so deleting a page also
 * removes its images instead of leaving them behind forever. Cleaning from a
 * test would race the workers capturing in parallel.
 */
export default async function globalSetup() {
  await rm(new URL('../screenshots/', import.meta.url), { recursive: true, force: true });
}
