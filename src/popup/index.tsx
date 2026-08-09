import React from 'react';
import { createRoot } from 'react-dom/client';
import { translations, type Lang, LANG_STORAGE_KEY, LANG_NAMES } from '../i18n/translations';
import './popup.css';

function Popup() {
  let lang: Lang = 'en';
  try {
    lang = (localStorage.getItem(LANG_STORAGE_KEY) as Lang) || 'en';
  } catch { /* ignore */ }

  const t = translations[lang];

  return (
    <main className="popup" dir={t.dir}>
      <header className="popup-header">
        <span className="popup-icon" aria-hidden="true">🌟</span>
        <h1 className="popup-title">{t.popupTitle}</h1>
      </header>
      <p className="popup-description">{t.popupDesc}</p>
      <p className="popup-tip">{t.popupTip}</p>
      <p className="popup-langs">
        🌐 {t.popupLangs}
        <span className="popup-lang-list">{Object.values(LANG_NAMES).join(' · ')}</span>
      </p>
      <footer className="popup-footer">
        <span aria-hidden="true">👏 👍 ❤️ ✋ 🎤</span>
      </footer>
    </main>
  );
}

const root = document.getElementById('popup-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
