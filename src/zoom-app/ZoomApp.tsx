import { EmojiPanel } from '../components/EmojiPanel/EmojiPanel';
import { HandRaiseButton } from '../components/HandRaiseButton/HandRaiseButton';
import { MuteToggle } from '../components/MuteToggle/MuteToggle';
import { ThemeProvider, useTheme } from '../themes/theme-context';
import { ThemePicker } from '../themes/ThemePicker';
import { useZoomAppControls } from '../hooks/useZoomAppControls';
import { useZoomAppState } from '../hooks/useZoomAppState';
import styles from './ZoomApp.module.css';
import type React from 'react';

type ZoomAppProps = {
  sdkReady: boolean;
  sdkError?: string;
};

function ZoomAppInner({ sdkReady, sdkError }: ZoomAppProps) {
  const { themeStyle } = useTheme();
  const { isMuted, isHandRaised } = useZoomAppState();
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
    debugLog,
  } = useZoomAppControls();

  if (!sdkReady) {
    return (
      <div className={styles.waiting}>
        <span className={styles.waitingEmoji}>⚠️</span>
        <p className={styles.waitingText}>לא הצלחנו להתחבר לזום</p>
        {sdkError && <p className={styles.errorDetail}>{sdkError}</p>}
      </div>
    );
  }

  return (
    <div
      className={styles.panel}
      style={themeStyle as React.CSSProperties}
      role="complementary"
      aria-label="בקרי זום לילדים"
      dir="rtl"
    >
      <div className={styles.header}>
        <span className={styles.logo} aria-label="Zoomi">Zoomi</span>
        <ThemePicker />
      </div>

      <EmojiPanel
        onClap={sendClap}
        onThumbsUp={sendThumbsUp}
        onHeart={sendHeart}
        onLaugh={sendLaugh}
        onParty={sendParty}
        onWow={sendWow}
      />

      <HandRaiseButton
        isHandRaised={isHandRaised}
        onRaise={raiseHand}
        onLower={lowerHand}
      />

      <MuteToggle isMuted={isMuted} onToggle={toggleMute} />

      {debugLog.length > 0 && (
        <div className={styles.debugLog} dir="ltr">
          {debugLog.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ZoomApp(props: ZoomAppProps) {
  return (
    <ThemeProvider>
      <ZoomAppInner {...props} />
    </ThemeProvider>
  );
}
