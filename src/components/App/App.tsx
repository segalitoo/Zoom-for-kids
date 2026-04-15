import { useState, useEffect } from 'react';
import { EmojiPanel } from '../EmojiPanel/EmojiPanel';
import { HandRaiseButton } from '../HandRaiseButton/HandRaiseButton';
import { MuteToggle } from '../MuteToggle/MuteToggle';
import { ThemeProvider, useTheme } from '../../themes/theme-context';
import { ThemePicker } from '../../themes/ThemePicker';
import { LanguageProvider, useLang } from '../../i18n/language-context';
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

function AppInner({ shadowRoot }: AppProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { themeStyle } = useTheme();
  const { t, toggleLang } = useLang();
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
          <button
            className={styles.langBtn}
            onClick={toggleLang}
            aria-label={t.langToggle}
            title={t.langToggle}
          >
            {t.langToggle}
          </button>
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
