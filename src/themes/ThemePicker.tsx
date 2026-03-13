import { useState } from 'react';
import { useTheme } from './theme-context';
import { themes, themeIds, type ThemeId } from './themes';
import styles from './ThemePicker.module.css';

export function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeId, setTheme } = useTheme();

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(0,0,0,0.1)',
          background: '#edf2f7',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="בחר עיצוב"
        title="בחר עיצוב"
      >
        🎨
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox" aria-label="עיצובים">
          {themeIds.map((id: ThemeId) => {
            const theme = themes[id];
            const isActive = id === themeId;
            return (
              <button
                key={id}
                className={`${styles.option} ${isActive ? styles.active : ''}`}
                onClick={() => {
                  setTheme(id);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isActive}
              >
                <span
                  className={styles.swatch}
                  style={{ background: theme.vars['--zoomi-bg'] }}
                />
                <span className={styles.optionEmoji}>{theme.emoji}</span>
                <span className={styles.optionName}>{theme.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
