/**
 * Dark mode support.
 *
 * PatternFly v6 themes itself with design tokens that are redefined under
 * `:root:where(.pf-v6-theme-dark)`, so switching themes is a matter of toggling
 * one class on the document element.
 */

export type Theme = 'light' | 'dark';

/** Class PatternFly looks for to apply its dark tokens. */
export const DARK_CLASS = 'pf-v6-theme-dark';

/** localStorage key holding an explicit choice. Absent means "follow the OS". */
export const STORAGE_KEY = 'theme';

/** Resolves the theme to use when the visitor has not chosen one. */
export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Reads an explicit choice, or falls back to the OS preference. */
export function currentTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : systemTheme();
}

/** Applies a theme to the document and remembers it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
}
