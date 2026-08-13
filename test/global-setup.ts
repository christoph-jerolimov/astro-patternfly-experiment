import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Builds the site once before the suite runs, so the tests always assert
 * against output produced from the current sources.
 *
 * This shells out to the CLI rather than calling Astro's programmatic `build()`
 * because the two do not define `import.meta.env.BASE_URL` identically, and the
 * suite checks base path handling. Running the same command as CI and the
 * deploy workflow keeps the tested artifact identical to the published one.
 */
export default function setup() {
  execFileSync('npm', ['run', 'build'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    stdio: 'inherit',
  });
}
