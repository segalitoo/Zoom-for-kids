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
    <section aria-label="שליטה במיקרופון">
      <button
        className={`${styles.btn} ${isMuted ? styles.muted : styles.unmuted} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isMuted}
        aria-label={isMuted ? 'הפעל מיקרופון' : 'השתק מיקרופון'}
      >
        <span className={styles.micIcon} aria-hidden="true">
          {isMuted ? '🔇' : '🎤'}
        </span>
        <div className={styles.textGroup}>
          <span className={styles.statusText}>
            {isMuted ? 'אני בשקט' : 'אני מדבר'}
          </span>
          <span className={styles.actionHint}>{isMuted ? 'לחץ לדבר' : 'לחץ להשתיק'}</span>
        </div>
      </button>
    </section>
  );
}
