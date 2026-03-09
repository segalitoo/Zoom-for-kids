import React, { useState, useCallback } from 'react';
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
      style={{ '--btn-color': color } as React.CSSProperties}
      onClick={handleClick}
      aria-label={`Send ${label} reaction`}
      title={label}
    >
      <span className={styles.emojiIcon} aria-hidden="true">
        {emoji}
      </span>
      <span className={styles.emojiLabel}>{label}</span>
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

const REACTIONS: Array<Omit<EmojiButtonProps, 'onClick'> & { key: keyof EmojiPanelProps }> = [
  { key: 'onClap', emoji: '👏', label: 'Clap', color: '#f59e0b' },
  { key: 'onThumbsUp', emoji: '👍', label: 'Good', color: '#22c55e' },
  { key: 'onHeart', emoji: '❤️', label: 'Love', color: '#ef4444' },
  { key: 'onLaugh', emoji: '😂', label: 'Funny', color: '#f97316' },
  { key: 'onParty', emoji: '🎉', label: 'Party', color: '#8b5cf6' },
  { key: 'onWow', emoji: '😮', label: 'Wow', color: '#06b6d4' },
];

export function EmojiPanel(props: EmojiPanelProps) {
  return (
    <section aria-label="Send a reaction">
      <p className={styles.sectionLabel}>React! 🎭</p>
      <div className={styles.grid}>
        {REACTIONS.map(({ key, emoji, label, color }) => (
          <EmojiButton
            key={key}
            emoji={emoji}
            label={label}
            color={color}
            onClick={props[key]}
          />
        ))}
      </div>
    </section>
  );
}
