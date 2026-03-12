import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type ThemeId, themes } from './themes';

type ThemeContextValue = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'classic',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function loadSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem('zoomi-theme');
    if (saved && saved in themes) return saved as ThemeId;
  } catch {}
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

  const themeVars = themes[themeId].vars;

  return (
    <ThemeContext.Provider value={{ themeId, setTheme }}>
      <div style={themeVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
