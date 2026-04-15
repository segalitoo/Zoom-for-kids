import { useState, useCallback } from 'react';
import { useLang } from '../../i18n/language-context';
import styles from './HandRaiseButton.module.css';

type HandRaiseButtonProps = {
  isHandRaised: boolean;
  onRaise: () => void | Promise<void>;
  onLower: () => void | Promise<void>;
};

export function HandRaiseButton({ isHandRaised, onRaise, onLower }: HandRaiseButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLang();

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
    <section aria-label={t.raiseHandSection}>
      <button
        className={`${styles.btn} ${isHandRaised ? styles.raised : styles.lowered} ${isAnimating ? styles.animating : ''}`}
        onClick={handleClick}
        aria-pressed={isHandRaised}
        aria-label={isHandRaised ? t.lowerHand : t.raiseHand}
      >
        <span className={styles.label}>
          {isHandRaised ? t.lowerHand : t.raiseHand}
        </span>
        <span className={styles.handIcon} aria-hidden="true">
          ✋
        </span>
      </button>
    </section>
  );
}
