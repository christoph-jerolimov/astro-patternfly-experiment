import { useEffect, useState } from 'react';
import {
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  MenuToggle,
  type MenuToggleElement,
} from '@patternfly/react-core';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';

import {
  applyMode,
  applyModifiers,
  currentMode,
  currentModifiers,
  DARK_CLASS,
  MODIFIERS,
  MODIFIERS_STORAGE_KEY,
  STORAGE_KEY,
  THEME_CLASS_PREFIX,
  type Mode,
  type ModifierId,
} from '../theme';

/**
 * Switches between PatternFly's four theme classes.
 *
 * The inline script in Layout.astro has already applied the right classes by
 * the time this hydrates, so the initial state is read back off the document
 * rather than computed again. Rendering a fixed icon on the server and
 * correcting it here keeps the server and client markup identical, which React
 * requires.
 */
export default function ThemeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('light');
  const [modifiers, setModifiers] = useState<ModifierId[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setMode(root.classList.contains(DARK_CLASS) ? 'dark' : 'light');
    setModifiers(
      MODIFIERS.map(({ id }) => id).filter((id) =>
        root.classList.contains(`${THEME_CLASS_PREFIX}${id}`),
      ),
    );
    setIsMounted(true);
  }, []);

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const contrast = window.matchMedia('(prefers-contrast: more)');

    const onColorScheme = () => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next = currentMode();
      document.documentElement.classList.toggle(DARK_CLASS, next === 'dark');
      setMode(next);
    };
    const onContrast = () => {
      if (localStorage.getItem(MODIFIERS_STORAGE_KEY) !== null) return;
      const next = currentModifiers();
      for (const { id } of MODIFIERS) {
        document.documentElement.classList.toggle(`${THEME_CLASS_PREFIX}${id}`, next.includes(id));
      }
      setModifiers(next);
    };

    colorScheme.addEventListener('change', onColorScheme);
    contrast.addEventListener('change', onContrast);
    return () => {
      colorScheme.removeEventListener('change', onColorScheme);
      contrast.removeEventListener('change', onContrast);
    };
  }, []);

  const chooseMode = (next: Mode) => {
    applyMode(next);
    setMode(next);
  };

  const toggleModifier = (id: ModifierId) => {
    const next = modifiers.includes(id)
      ? modifiers.filter((current) => current !== id)
      : [...modifiers, id];
    applyModifiers(next);
    setModifiers(next);
  };

  const isDark = isMounted && mode === 'dark';

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      popperProps={{ position: 'right' }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          aria-label="Appearance"
          isExpanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </MenuToggle>
      )}
    >
      <DropdownGroup label="Theme">
        <DropdownList>
          {(['light', 'dark'] as const).map((value) => (
            <DropdownItem
              key={value}
              value={value}
              hasCheckbox
              isSelected={isMounted && mode === value}
              onClick={() => chooseMode(value)}
            >
              {value === 'light' ? 'Light' : 'Dark'}
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownGroup>

      <Divider component="li" />

      <DropdownGroup label="Modifiers">
        <DropdownList>
          {MODIFIERS.map((modifier) => (
            <DropdownItem
              key={modifier.id}
              value={modifier.id}
              hasCheckbox
              isSelected={isMounted && modifiers.includes(modifier.id)}
              description={modifier.description}
              onClick={() => toggleModifier(modifier.id)}
            >
              {modifier.label}
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownGroup>
    </Dropdown>
  );
}
