import React, { createContext, useContext, useState } from 'react';
import { translations, type Lang, type Translations, LANG_STORAGE_KEY } from './translations';

type LanguageContextType = {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    try { localStorage.setItem(LANG_STORAGE_KEY, next); } catch { /* ignore */ }
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
