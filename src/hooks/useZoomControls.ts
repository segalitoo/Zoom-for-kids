import { useCallback } from 'react';

const LOG = '[Zoom for Kids]';

/**
 * Find a Zoom element by exact aria-label match.
 */
function findByExactLabel(label: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[aria-label="${label}"]`);
}

/**
 * Find a Zoom element by partial aria-label match (case-insensitive).
 */
function findByPartialLabel(partial: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>('[aria-label]');
  for (const el of all) {
    if (el.ariaLabel?.toLowerCase().includes(partial.toLowerCase())) {
      return el;
    }
  }
  return null;
}

function findZoomElement(label: string): HTMLElement | null {
  return findByExactLabel(label) || findByPartialLabel(label);
}

/**
 * Simulate a real mouse click sequence (mousedown → mouseup → click).
 * Some React/framework UIs only respond to full event sequences.
 */
function simulateClick(el: HTMLElement): void {
  const opts = { bubbles: true, cancelable: true, view: window };
  el.dispatchEvent(new MouseEvent('mousedown', opts));
  el.dispatchEvent(new MouseEvent('mouseup', opts));
  el.dispatchEvent(new MouseEvent('click', opts));
}

function clickZoomElement(label: string): boolean {
  const el = findZoomElement(label);
  if (!el) {
    console.warn(`${LOG} Element not found: "${label}"`);
    return false;
  }
  simulateClick(el);
  return true;
}

/**
 * Open the Zoom Reactions popup. Tries multiple known aria-labels.
 */
function openReactionsPopup(): boolean {
  const candidates = ['Reactions', 'React', 'Send a reaction', 'reaction'];
  for (const label of candidates) {
    const el = findZoomElement(label);
    if (el) {
      console.log(`${LOG} Opening reactions via: "${el.ariaLabel}"`);
      simulateClick(el);
      return true;
    }
  }
  console.warn(`${LOG} Could not find Reactions button. Available aria-labels:`,
    Array.from(document.querySelectorAll<HTMLElement>('[aria-label]'))
      .map(e => e.ariaLabel)
      .filter(Boolean)
      .slice(0, 30)
  );
  return false;
}

/**
 * Wait for an element with the given aria-label to appear, then click it.
 * Polls every 100ms for up to 2.5 seconds.
 */
function waitAndClick(label: string, maxWaitMs = 2500): Promise<boolean> {
  return new Promise((resolve) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = findZoomElement(label);
      if (el) {
        console.log(`${LOG} Found and clicking: "${label}"`);
        simulateClick(el);
        resolve(true);
        return;
      }
      elapsed += interval;
      if (elapsed >= maxWaitMs) {
        console.warn(`${LOG} Timed out waiting for: "${label}"`);
        resolve(false);
        return;
      }
      setTimeout(check, interval);
    };
    check();
  });
}

/**
 * Wait for an element matching a CSS selector to appear, then click it.
 */
function waitForAndClick(selector: string, maxWaitMs = 2500): Promise<boolean> {
  return new Promise((resolve) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        console.log(`${LOG} Found and clicking selector: "${selector}"`);
        simulateClick(el);
        resolve(true);
        return;
      }
      elapsed += interval;
      if (elapsed >= maxWaitMs) {
        console.warn(`${LOG} Timed out waiting for selector: "${selector}"`);
        resolve(false);
        return;
      }
      setTimeout(check, interval);
    };
    check();
  });
}

/**
 * Find the raise-hand button by trying multiple selectors in order.
 * Zoom changes class names frequently; aria-label is more stable.
 */
async function clickRaiseHand(): Promise<boolean> {
  const selectors = [
    // CSS class-based (may change between Zoom updates)
    '.reaction-simple-picker__block--raise-hand',
    '[class*="raise-hand"]',
    '[class*="raiseHand"]',
    // aria-label-based (more stable)
    '[aria-label="Raise Hand"]',
    '[aria-label="raise hand"]',
    '[aria-label*="Raise Hand"]',
    '[aria-label*="raise hand"]',
    '[aria-label="Lower Hand"]',
    '[aria-label*="Lower Hand"]',
    '[aria-label*="lower hand"]',
  ];

  for (const sel of selectors) {
    const result = await waitForAndClick(sel, 600);
    if (result) return true;
  }

  console.warn(`${LOG} Could not find raise hand button. Checking popup contents...`);
  const popup = document.querySelector('[class*="reaction-picker"], [class*="reactions-picker"], [class*="emoji-picker"], [role="dialog"]');
  if (popup) {
    console.log(`${LOG} Popup found:`, popup.innerHTML.slice(0, 500));
  }
  return false;
}

/**
 * Send an emoji reaction. Tries the known aria-label variants for each emoji.
 */
async function sendEmojiReaction(emojiLabels: string[]): Promise<boolean> {
  for (const label of emojiLabels) {
    const el = findZoomElement(label);
    if (el) {
      console.log(`${LOG} Sending reaction via: "${label}"`);
      simulateClick(el);
      return true;
    }
  }
  // Try waiting for them
  for (const label of emojiLabels) {
    const result = await waitAndClick(label, 600);
    if (result) return true;
  }
  return false;
}

const HIDE_STYLE_ID = 'zoomi-hide-reactions';

/**
 * Inject CSS that makes Zoom's reactions panel invisible (but still in DOM + clickable).
 * We use opacity:0 so pointer events still work — we can still find and click emoji buttons.
 */
function hideZoomReactionsPanel(): void {
  if (document.getElementById(HIDE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HIDE_STYLE_ID;
  style.textContent = [
    '[class*="reaction-simple-picker"]',
    '[class*="reactions-picker"]',
    '[class*="reaction-picker"]',
    '[class*="reactions-popup"]',
  ].join(',') + ' { opacity: 0 !important; }';
  document.head.appendChild(style);
}

function showZoomReactionsPanel(): void {
  document.getElementById(HIDE_STYLE_ID)?.remove();
}

/**
 * Close Zoom's reactions popup by pressing Escape.
 */
function closeReactionsPopup(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
}

/**
 * Provides functions to interact with Zoom's web client control bar.
 *
 * All Zoom DOM interactions are contained here — components must not
 * query Zoom's DOM directly.
 */
export function useZoomControls() {
  const sendReaction = useCallback(async (emojiLabels: string[]): Promise<void> => {
    hideZoomReactionsPanel();
    const opened = openReactionsPopup();
    if (!opened) { showZoomReactionsPanel(); return; }
    await new Promise(r => setTimeout(r, 200));
    await sendEmojiReaction(emojiLabels);
    closeReactionsPopup();
    showZoomReactionsPanel();
  }, []);

  const sendClap = useCallback(() =>
    sendReaction(['clapping hands', 'Clapping Hands', 'clap', '👏']),
  [sendReaction]);

  const sendThumbsUp = useCallback(() =>
    sendReaction(['thumbs up', 'Thumbs Up', 'thumbs_up', '👍']),
  [sendReaction]);

  const sendHeart = useCallback(() =>
    sendReaction(['red heart', 'Red Heart', 'heart', '❤️']),
  [sendReaction]);

  const sendLaugh = useCallback(() =>
    sendReaction(['face with tears of joy', 'Face with Tears of Joy', 'laugh', '😂']),
  [sendReaction]);

  const sendParty = useCallback(() =>
    sendReaction(['party popper', 'Party Popper', 'party', '🎉']),
  [sendReaction]);

  const sendWow = useCallback(() =>
    sendReaction(['face with open mouth', 'Face with Open Mouth', 'wow', '😮']),
  [sendReaction]);

  const raiseHand = useCallback(async (): Promise<void> => {
    hideZoomReactionsPanel();
    const opened = openReactionsPopup();
    if (!opened) { showZoomReactionsPanel(); return; }
    await new Promise(r => setTimeout(r, 200));
    await clickRaiseHand();
    closeReactionsPopup();
    showZoomReactionsPanel();
  }, []);

  const lowerHand = useCallback(async (): Promise<void> => {
    hideZoomReactionsPanel();
    const opened = openReactionsPopup();
    if (!opened) { showZoomReactionsPanel(); return; }
    await new Promise(r => setTimeout(r, 200));
    await clickRaiseHand();
    closeReactionsPopup();
    showZoomReactionsPanel();
  }, []);

  const toggleMute = useCallback((): void => {
    const unmuted = clickZoomElement('unmute my microphone');
    if (!unmuted) clickZoomElement('mute my microphone');
  }, []);

  return {
    sendClap,
    sendThumbsUp,
    sendHeart,
    sendLaugh,
    sendParty,
    sendWow,
    raiseHand,
    lowerHand,
    toggleMute,
  };
}
