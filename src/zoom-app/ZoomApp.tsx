import { EmojiPanel } from '../components/EmojiPanel/EmojiPanel';
import { HandRaiseButton } from '../components/HandRaiseButton/HandRaiseButton';
import { MuteToggle } from '../components/MuteToggle/MuteToggle';
import { ThemeProvider } from '../themes/theme-context';
import { ThemePicker } from '../themes/ThemePicker';
import { useZoomAppControls } from '../hooks/useZoomAppControls';
import { useZoomAppState } from '../hooks/useZoomAppState';
import styles from './ZoomApp.module.css';

export function ZoomApp() {
  const { isMuted, isHandRaised, isMeetingActive } = useZoomAppState();
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
  } = useZoomAppControls();

  return (
    <ThemeProvider>
      {!isMeetingActive ? (
        <div className={styles.waiting}>
          <span className={styles.waitingEmoji}>🚀</span>
          <p className={styles.waitingText}>ממתין לפגישה...</p>
        </div>
      ) : (
        <div className={styles.panel} role="complementary" aria-label="בקרי זום לילדים" dir="rtl">
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
        </div>
      )}
    </ThemeProvider>
  );
}
