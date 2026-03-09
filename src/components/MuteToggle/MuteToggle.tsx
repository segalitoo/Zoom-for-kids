import { useState, useCallback } from 'react';
import styles from './MuteToggle.module.css';

type MuteToggleProps = {
  isMuted: boolean;
  onToggle: () => void;
};

export function MuteToggle({ isMuted, onToggle }: MuteToggleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 350);
    onToggle();
  }, [onToggle]);

  return (
    <section aria-label="Microphone control">
      <button
        className={`${styles.btn} ${isMuted ? styles.muted : styles.unmuted} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isMuted}
        aria-label={isMuted ? 'Unmute your microphone' : 'Mute your microphone'}
      >
        <span className={styles.micIcon} aria-hidden="true">
          {isMuted ? '🔇' : '🎤'}
        </span>
        <div className={styles.textGroup}>
          <span className={styles.statusText}>{isMuted ? "I'm quiet" : 'I can talk'}</span>
          <span className={styles.actionHint}>{isMuted ? 'tap to speak' : 'tap to mute'}</span>
        </div>
      </button>
    </section>
  );
}
