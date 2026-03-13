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
    <section aria-label="הרמת יד">
      <button
        className={`${styles.btn} ${isHandRaised ? styles.raised : styles.lowered} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isHandRaised}
        aria-label={isHandRaised ? 'הורד יד' : 'הרם יד'}
      >
        <span className={styles.label}>
          {isHandRaised ? 'הורד יד' : 'הרם יד'}
        </span>
        <span className={styles.handIcon} aria-hidden="true">
          ✋
        </span>
      </button>
    </section>
  );
}
