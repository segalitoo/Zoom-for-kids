import { useState, useCallback } from 'react';
import styles from './HandRaiseButton.module.css';

type HandRaiseButtonProps = {
  isHandRaised: boolean;
  onRaise: () => void | Promise<void>;
  onLower: () => void | Promise<void>;
};

export function HandRaiseButton({ isHandRaised, onRaise, onLower }: HandRaiseButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(async () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 450);
    if (isHandRaised) {
      await onLower();
    } else {
      await onRaise();
    }
  }, [isHandRaised, onRaise, onLower]);

  return (
    <section aria-label="Hand raise control">
      <button
        className={`${styles.btn} ${isHandRaised ? styles.raised : styles.lowered} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isHandRaised}
        aria-label={isHandRaised ? 'Lower your hand' : 'Raise your hand'}
      >
        <span className={styles.handIcon} aria-hidden="true">
          ✋
        </span>
        <span className={styles.label}>
          {isHandRaised ? 'Hand Up!' : 'Raise Hand'}
        </span>
        {isHandRaised && (
          <span className={styles.tapHint} aria-hidden="true">
            tap to lower
          </span>
        )}
      </button>
    </section>
  );
}
