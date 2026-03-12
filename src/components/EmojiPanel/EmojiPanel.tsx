import React, { useState, useCallback } from 'react';
import { useTheme } from '../../themes/theme-context';
import { themes } from '../../themes/themes';
import styles from './EmojiPanel.module.css';

type EmojiButtonProps = {
  emoji: string;
  label: string;
  color: string;
  onClick: () => void | Promise<void>;
};

function EmojiButton({ emoji, label, color, onClick }: EmojiButtonProps) {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = useCallback(async () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);
    await onClick();
  }, [onClick]);

  return (
    <button
      className={`${styles.emojiBtn} ${isPopping ? styles.popping : ''}`}
      style={{ '--btn-color': color, '--btn-shadow': `${color}cc` } as React.CSSProperties}
      onClick={handleClick}
      aria-label={`שלח תגובת ${label}`}
      title={label}
    >
      <span className={styles.emojiIcon} aria-hidden="true">
        {emoji}
      </span>
    </button>
  );
}

type EmojiPanelProps = {
  onClap: () => void | Promise<void>;
  onThumbsUp: () => void | Promise<void>;
  onHeart: () => void | Promise<void>;
  onLaugh: () => void | Promise<void>;
  onParty: () => void | Promise<void>;
  onWow: () => void | Promise<void>;
};

const REACTION_KEYS: Array<{ key: keyof EmojiPanelProps; emoji: string; label: string; colorIndex: number }> = [
  { key: 'onHeart', emoji: '❤️', label: 'אהבה', colorIndex: 0 },
  { key: 'onThumbsUp', emoji: '👍', label: 'סבבה', colorIndex: 1 },
  { key: 'onClap', emoji: '👏', label: 'כל הכבוד', colorIndex: 2 },
  { key: 'onWow', emoji: '😮', label: 'וואו', colorIndex: 3 },
  { key: 'onParty', emoji: '🎉', label: 'יאללה', colorIndex: 4 },
  { key: 'onLaugh', emoji: '😂', label: 'מצחיק', colorIndex: 5 },
];

export function EmojiPanel(props: EmojiPanelProps) {
  const { themeId } = useTheme();
  const emojiColors = themes[themeId].emojiColors;

  return (
    <section aria-label="שלח תגובה">
      <div className={styles.grid}>
        {REACTION_KEYS.map(({ key, emoji, label, colorIndex }) => (
          <EmojiButton
            key={key}
            emoji={emoji}
            label={label}
            color={emojiColors[colorIndex]}
            onClick={props[key]}
          />
        ))}
      </div>
    </section>
  );
}
