import { useState, useEffect, useRef } from 'react';
import { EmojiPanel } from '../EmojiPanel/EmojiPanel';
import { HandRaiseButton } from '../HandRaiseButton/HandRaiseButton';
import { MuteToggle } from '../MuteToggle/MuteToggle';
import { ThemeProvider, useTheme } from '../../themes/theme-context';
import { ThemePicker } from '../../themes/ThemePicker';
import { LanguageProvider, useLang } from '../../i18n/language-context';
import { LANG_NAMES, type Lang } from '../../i18n/translations';
import { useZoomControls } from '../../hooks/useZoomControls';
import { useMeetingState } from '../../hooks/useMeetingState';
import styles from './App.module.css';

// Inject styles as raw strings into the shadow root (Vite ?inline query)
import appCss from './App.module.css?inline';
import contentCss from '../../content/content.css?inline';
import emojiCss from '../EmojiPanel/EmojiPanel.module.css?inline';
import handRaiseCss from '../HandRaiseButton/HandRaiseButton.module.css?inline';
import muteCss from '../MuteToggle/MuteToggle.module.css?inline';
import themePickerCss from '../../themes/ThemePicker.module.css?inline';

type AppProps = {
  shadowRoot: ShadowRoot;
};

const GLOBE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

function AppInner({ shadowRoot }: AppProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langPickerRef = useRef<HTMLDivElement>(null);
  const { themeStyle } = useTheme();
  const { lang, t, setLang } = useLang();
  const { isMuted, isHandRaised, isMeetingActive, isLeaveDialogOpen } = useMeetingState();
  const {
    sendClap,
    sendThumbsUp,
    sendHeart,
    sendLaugh,
    sendParty,
    sendWow,
    raiseHand,
    lowerHand,
    toggleMute,
  } = useZoomControls();

  // Inject CSS into shadow root so styles are scoped correctly
  useEffect(() => {
    const existing = shadowRoot.querySelector('#zoom-kids-styles');
    if (existing) return;

    // Load Varela Round from Google Fonts in both document and shadow DOM
    const googleFontsUrl = 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap';

    if (!document.querySelector('#zoom-kids-font')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'zoom-kids-font';
      fontLink.rel = 'stylesheet';
      fontLink.href = googleFontsUrl;
      document.head.appendChild(fontLink);
    }

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = googleFontsUrl;
    shadowRoot.insertBefore(fontLink, shadowRoot.firstChild);

    const styleEl = document.createElement('style');
    styleEl.id = 'zoom-kids-styles';
    styleEl.textContent = [contentCss, appCss, emojiCss, handRaiseCss, muteCss, themePickerCss].join('\n');
    shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
  }, [shadowRoot]);

  // Close lang picker when clicking outside (composedPath works across shadow DOM boundary)
  useEffect(() => {
    if (!isLangOpen) return;
    const handler = (e: MouseEvent) => {
      if (langPickerRef.current && !e.composedPath().includes(langPickerRef.current)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('click', handler, { capture: true });
    return () => document.removeEventListener('click', handler, { capture: true });
  }, [isLangOpen]);

  if (!isMeetingActive) return null;

  const panelStyle: React.CSSProperties = {
    ...(themeStyle as React.CSSProperties),
    ...(isLeaveDialogOpen ? { bottom: '160px' } : {}),
  };

  if (!isExpanded) {
    return (
      <button
        className={styles.minimizedBtn}
        style={panelStyle}
        onClick={() => setIsExpanded(true)}
        aria-label={t.openPanel}
        title={t.openTitle}
      >
        🚀
      </button>
    );
  }

  return (
    <div
      className={styles.panel}
      style={panelStyle}
      role="complementary"
      aria-label={t.panelLabel}
      dir={t.dir}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.logo} aria-label="Zoomi">Zoomi</span>
        <div className={styles.headerRight}>

          {/* Language picker */}
          <div ref={langPickerRef} style={{ position: 'relative' }}>
            <button
              className={styles.globeBtn}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t.chooseLang}
              title={t.chooseLang}
              aria-expanded={isLangOpen}
              aria-haspopup="listbox"
            >
              {GLOBE_ICON}
            </button>

            {isLangOpen && (
              <div className={styles.langDropdown} role="listbox" aria-label={t.chooseLang}>
                {(Object.keys(LANG_NAMES) as Lang[]).map((code) => (
                  <button
                    key={code}
                    className={`${styles.langOption} ${code === lang ? styles.langOptionActive : ''}`}
                    role="option"
                    aria-selected={code === lang}
                    onClick={() => {
                      setLang(code);
                      setIsLangOpen(false);
                    }}
                  >
                    {code === lang && <span className={styles.langCheck} aria-hidden="true">✓</span>}
                    {LANG_NAMES[code]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemePicker />
          <button
            className={styles.minimizeBtn}
            onClick={() => setIsExpanded(false)}
            aria-label={t.minimize}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Emoji reactions */}
      <EmojiPanel
        onClap={sendClap}
        onThumbsUp={sendThumbsUp}
        onHeart={sendHeart}
        onLaugh={sendLaugh}
        onParty={sendParty}
        onWow={sendWow}
      />

      {/* Hand raise */}
      <HandRaiseButton
        isHandRaised={isHandRaised}
        onRaise={raiseHand}
        onLower={lowerHand}
      />

      {/* Mute toggle */}
      <MuteToggle isMuted={isMuted} onToggle={toggleMute} />
    </div>
  );
}

export function App({ shadowRoot }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppInner shadowRoot={shadowRoot} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
