import React, { useState, useCallback } from 'react';
import { useTheme } from '../../themes/theme-context';
import { themes } from '../../themes/themes';
import { useLang } from '../../i18n/language-context';
import './animations.css';
import styles from './EmojiPanel.module.css';

type EmojiButtonProps = {
  emoji: string;
  label: string;
  color: string;
  index: number;
  shouldFloat: boolean;
  onClick: () => void | Promise<void>;
};

function EmojiButton({ emoji, label, color, index, shouldFloat, onClick }: EmojiButtonProps) {
  const [isPopping, setIsPopping] = useState(false);
  const { t } = useLang();

  const handleClick = useCallback(async () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);
    await onClick();
  }, [onClick]);

  const className = [
    styles.emojiBtn,
    isPopping ? styles.popping : '',
    shouldFloat ? 'zoomi-float' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      style={{ '--btn-color': color, '--btn-shadow': `${color}cc`, animationDelay: shouldFloat ? `0s, ${index * 0.4}s` : undefined } as React.CSSProperties}
      onClick={handleClick}
      aria-label={t.sendReactionOf(label)}
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

const REACTION_KEYS: Array<{ key: keyof EmojiPanelProps; emoji: string; colorIndex: number; labelIndex: number }> = [
  { key: 'onHeart',    emoji: '❤️', colorIndex: 0, labelIndex: 0 },
  { key: 'onThumbsUp', emoji: '👍', colorIndex: 1, labelIndex: 1 },
  { key: 'onClap',     emoji: '👏', colorIndex: 2, labelIndex: 2 },
  { key: 'onWow',      emoji: '😮', colorIndex: 3, labelIndex: 3 },
  { key: 'onParty',    emoji: '🎉', colorIndex: 4, labelIndex: 4 },
  { key: 'onLaugh',    emoji: '😂', colorIndex: 5, labelIndex: 5 },
];

export function EmojiPanel(props: EmojiPanelProps) {
  const { themeId } = useTheme();
  const { t } = useLang();
  const theme = themes[themeId];
  const shouldFloat = !!theme.vars['--zoomi-emoji-float'];

  return (
    <section aria-label={t.sendReaction}>
      <div className={styles.grid}>
        {REACTION_KEYS.map(({ key, emoji, colorIndex, labelIndex }, i) => (
          <EmojiButton
            key={key}
            emoji={emoji}
            label={t.emojiLabels[labelIndex]}
            color={theme.emojiColors[colorIndex]}
            index={i}
            shouldFloat={shouldFloat}
            onClick={props[key]}
          />
        ))}
      </div>
    </section>
  );
}
