/**
 * Theme support.
 *
 * PatternFly v6 themes itself with design tokens that are redefined under
 * `:root:where(.pf-v6-theme-<name>)`, so every theme is one class on the
 * document element. There are four, and they compose:
 *
 * - `dark`          the dark palette
 * - `high-contrast` thicker borders and stronger affordances, for accessibility
 * - `glass`         translucent surfaces over a backdrop image
 * - `felt`          the other surface treatment
 *
 * Dark is a mode with three states (light, dark, or follow the OS). The other
 * three are independent switches on top of it.
 */

export type Mode = 'light' | 'dark';
export type ModifierId = 'high-contrast' | 'glass' | 'felt';

/** Class prefix PatternFly looks for. */
export const THEME_CLASS_PREFIX = 'pf-v6-theme-';

/** Class that applies the dark palette. Kept for the pre-paint script. */
export const DARK_CLASS = `${THEME_CLASS_PREFIX}dark`;

/** localStorage key holding an explicit light/dark choice. Absent = follow OS. */
export const STORAGE_KEY = 'theme';

/** localStorage key holding the chosen modifiers, comma separated. */
export const MODIFIERS_STORAGE_KEY = 'theme-modifiers';

export interface Modifier {
  id: ModifierId;
  label: string;
  description: string;
}

export const MODIFIERS: Modifier[] = [
  {
    id: 'high-contrast',
    label: 'High contrast',
    description: 'Thicker borders and stronger hover and focus states.',
  },
  {
    id: 'glass',
    label: 'Glass',
    description: 'Translucent surfaces over a backdrop.',
  },
  {
    id: 'felt',
    label: 'Felt',
    description: 'A textured surface treatment.',
  },
];

const MODIFIER_IDS = MODIFIERS.map((modifier) => modifier.id);

/** The theme to use when the visitor has not chosen one. */
export function systemMode(): Mode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Reads an explicit light/dark choice, or falls back to the OS preference. */
export function currentMode(): Mode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : systemMode();
}

/**
 * Reads the chosen modifiers.
 *
 * With no explicit choice, high contrast follows `prefers-contrast: more`.
 * PatternFly ships no `prefers-contrast` query of its own, so without this a
 * reader who has asked their OS for more contrast would not get it.
 */
export function currentModifiers(): ModifierId[] {
  const stored = localStorage.getItem(MODIFIERS_STORAGE_KEY);
  if (stored === null) {
    return window.matchMedia('(prefers-contrast: more)').matches ? ['high-contrast'] : [];
  }
  return stored
    .split(',')
    .filter((id): id is ModifierId => (MODIFIER_IDS as string[]).includes(id));
}

/** Applies a light/dark choice to the document and remembers it. */
export function applyMode(mode: Mode): void {
  document.documentElement.classList.toggle(DARK_CLASS, mode === 'dark');
  localStorage.setItem(STORAGE_KEY, mode);
}

/** Applies a set of modifiers to the document and remembers it. */
export function applyModifiers(modifiers: ModifierId[]): void {
  for (const { id } of MODIFIERS) {
    document.documentElement.classList.toggle(`${THEME_CLASS_PREFIX}${id}`, modifiers.includes(id));
  }
  // An empty string is still an explicit choice: it stops high contrast being
  // re-derived from prefers-contrast after the visitor turns it off.
  localStorage.setItem(MODIFIERS_STORAGE_KEY, modifiers.join(','));
}
