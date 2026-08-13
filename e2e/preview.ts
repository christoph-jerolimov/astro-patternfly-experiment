import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/** Port the preview server listens on while the screenshots are captured. */
export const PREVIEW_PORT = 4327;

const cwd = fileURLToPath(new URL('..', import.meta.url));

function astro(...args: string[]) {
  execFileSync('npx', ['astro', ...args], { cwd, stdio: 'inherit' });
}

/**
 * Builds the site and starts Astro's preview server, which serves dist/ under
 * the configured base the same way GitHub Pages hosts it.
 *
 * This is driven from global setup rather than Playwright's `webServer` because
 * `astro preview` always detaches into a background daemon and returns
 * immediately. Playwright reads that exit as "the server died" and fails the
 * run, so the daemon is started and stopped explicitly instead.
 */
export async function startPreview(url: string) {
  execFileSync('npm', ['run', 'build'], { cwd, stdio: 'inherit' });
  astro('preview', '--port', String(PREVIEW_PORT));

  // The CLI returns once the daemon reports it is listening, but poll anyway so
  // a slow start fails here with a clear message rather than inside a test.
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`preview server was not reachable at ${url} within 30s`);
}

/** Stops the preview daemon. Safe to call when none is running. */
export function stopPreview() {
  try {
    astro('preview', 'stop');
  } catch {
    // Nothing to stop.
  }
}
