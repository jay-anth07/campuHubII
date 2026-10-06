import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccentColor } from '../types';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentStyles: {
    gradient: string;
    headerGradient: string;
    text: string;
    slider: string;
    ring: string;
    badge: string;
    colorHex: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_CONFIGS: Record<AccentColor, {
  name: string;
  colorHex: string;
  gradient: string;
  headerGradient: string;
  text: string;
  slider: string;
  ring: string;
  badge: string;
}> = {
  teal: {
    name: 'Teal & Cyan',
    colorHex: '#0ea5e9',
    gradient: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400 text-white',
    headerGradient: 'bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white',
    text: 'text-cyan-600 dark:text-cyan-400',
    slider: 'accent-cyan-500',
    ring: 'ring-cyan-500/40',
    badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  emerald: {
    name: 'Emerald Green',
    colorHex: '#059669',
    gradient: 'bg-gradient-to-r from-emerald-600 to-teal-400 text-white',
    headerGradient: 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 text-white',
    text: 'text-emerald-600 dark:text-emerald-400',
    slider: 'accent-emerald-500',
    ring: 'ring-emerald-500/40',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  blue: {
    name: 'Royal Blue',
    colorHex: '#2563eb',
    gradient: 'bg-gradient-to-r from-blue-600 to-sky-400 text-white',
    headerGradient: 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white',
    text: 'text-blue-600 dark:text-blue-400',
    slider: 'accent-blue-500',
    ring: 'ring-blue-500/40',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  },
  purple: {
    name: 'Violet Purple',
    colorHex: '#7c3aed',
    gradient: 'bg-gradient-to-r from-violet-600 to-indigo-400 text-white',
    headerGradient: 'bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-500 text-white',
    text: 'text-purple-600 dark:text-purple-400',
    slider: 'accent-purple-500',
    ring: 'ring-purple-500/40',
    badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  },
  orange: {
    name: 'Warm Coral',
    colorHex: '#ea580c',
    gradient: 'bg-gradient-to-r from-orange-600 to-amber-400 text-white',
    headerGradient: 'bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 text-white',
    text: 'text-orange-600 dark:text-orange-400',
    slider: 'accent-orange-500',
    ring: 'ring-orange-500/40',
    badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('campushub_theme') === 'dark';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('campushub_accent') as AccentColor;
    if (saved && ACCENT_CONFIGS[saved]) {
      return saved;
    }
    // Handle migration from previous color keys
    if (saved === ('indigo' as any)) return 'blue';
    if (saved === ('cyan' as any)) return 'teal';
    if (saved === ('amber' as any) || saved === ('rose' as any)) return 'orange';
    return 'teal';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('campushub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('campushub_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('campushub_accent', accent);
  }, [accent]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const setAccent = (newAccent: AccentColor) => {
    if (ACCENT_CONFIGS[newAccent]) {
      setAccentState(newAccent);
    } else {
      setAccentState('teal');
    }
  };

  const activeConfig = ACCENT_CONFIGS[accent] || ACCENT_CONFIGS.teal;
  const accentStyles = {
    gradient: activeConfig.gradient,
    headerGradient: activeConfig.headerGradient,
    text: activeConfig.text,
    slider: activeConfig.slider,
    ring: activeConfig.ring,
    badge: activeConfig.badge,
    colorHex: activeConfig.colorHex,
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, accent, setAccent, accentStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
