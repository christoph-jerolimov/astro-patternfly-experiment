import { useEffect, useState } from 'react';
import { Button } from '@patternfly/react-core';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';

import { applyTheme, currentTheme, DARK_CLASS, STORAGE_KEY, type Theme } from '../theme';

/**
 * Switches between the light and dark PatternFly themes.
 *
 * The inline script in Layout.astro has already applied the right theme by the
 * time this hydrates, so the initial state is read back off the document rather
 * than computed again. Rendering a fixed icon on the server and correcting it
 * here keeps the server and client markup identical, which React requires.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light');
    setIsMounted(true);
  }, []);

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next = currentTheme();
      document.documentElement.classList.toggle(DARK_CLASS, next === 'dark');
      setTheme(next);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  };

  const isDark = isMounted && theme === 'dark';

  return (
    <Button
      variant="plain"
      onClick={toggle}
      aria-label={isDark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      icon={isDark ? <SunIcon /> : <MoonIcon />}
    />
  );
}
