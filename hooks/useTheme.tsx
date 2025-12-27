import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

export const useTheme = (initialTheme: ThemeMode = 'system') => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sea-eve-theme');
    return (saved as ThemeMode) || initialTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('sea-eve-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};