import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type ThemeId, themes } from './themes';

type ThemeContextValue = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  themeStyle: Record<string, string>;
};

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'classic',
  setTheme: () => {},
  themeStyle: themes.classic.vars,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function loadSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem('zoomi-theme');
    if (saved && saved in themes) return saved as ThemeId;
  } catch {
    // localStorage may not be available in some contexts
  }
  return 'classic';
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(loadSavedTheme);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    try {
      localStorage.setItem('zoomi-theme', id);
    } catch {}
  }, []);

  const themeStyle = themes[themeId].vars;

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, themeStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}
