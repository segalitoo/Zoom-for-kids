import { useState, useCallback } from 'react';
import { useLang } from '../../i18n/language-context';
import styles from './MuteToggle.module.css';

type MuteToggleProps = {
  isMuted: boolean;
  onToggle: () => void;
};

export function MuteToggle({ isMuted, onToggle }: MuteToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLang();

  const handleClick = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 350);
    onToggle();
  }, [onToggle]);

  return (
    <section aria-label={t.micSection}>
      <button
        className={`${styles.btn} ${isMuted ? styles.muted : styles.unmuted} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isMuted}
        aria-label={isMuted ? t.unmute : t.mute}
      >
        <span className={styles.micIcon} aria-hidden="true">
          {isMuted ? '🔇' : '🎤'}
        </span>
        <div className={styles.textGroup}>
          <span className={styles.statusText}>
            {isMuted ? t.muted : t.speaking}
          </span>
          <span className={styles.actionHint}>{isMuted ? t.tapToSpeak : t.tapToMute}</span>
        </div>
      </button>
    </section>
  );
}
