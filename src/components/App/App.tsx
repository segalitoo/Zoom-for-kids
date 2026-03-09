import { useState, useEffect } from 'react';
import { EmojiPanel } from '../EmojiPanel/EmojiPanel';
import { HandRaiseButton } from '../HandRaiseButton/HandRaiseButton';
import { MuteToggle } from '../MuteToggle/MuteToggle';
import { useZoomControls } from '../../hooks/useZoomControls';
import { useMeetingState } from '../../hooks/useMeetingState';
import styles from './App.module.css';

// Inject styles as raw strings into the shadow root (Vite ?inline query)
import appCss from './App.module.css?inline';
import contentCss from '../../content/content.css?inline';

type AppProps = {
  shadowRoot: ShadowRoot;
};

export function App({ shadowRoot }: AppProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isMuted, isHandRaised, isMeetingActive } = useMeetingState();
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

    const styleEl = document.createElement('style');
    styleEl.id = 'zoom-kids-styles';
    styleEl.textContent = contentCss + '\n' + appCss;
    shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
  }, [shadowRoot]);

  if (!isMeetingActive) return null;

  if (!isExpanded) {
    return (
      <button
        className={styles.minimizedBtn}
        onClick={() => setIsExpanded(true)}
        aria-label="פתח את בקרי זום לילדים"
        title="פתח זום לילדים"
      >
        🚀
      </button>
    );
  }

  return (
    <div className={styles.panel} role="complementary" aria-label="בקרי זום לילדים" dir="rtl">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <span aria-hidden="true">🌟</span> זום לילדים
        </span>
        <button
          className={styles.minimizeBtn}
          onClick={() => setIsExpanded(false)}
          aria-label="מזער"
        >
          ✕
        </button>
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
