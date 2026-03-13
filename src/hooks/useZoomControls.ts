import { useCallback } from 'react';

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
    console.warn(`[Zoom for Kids] Element not found: "${label}"`);
    return false;
  }
  simulateClick(el);
  return true;
}

/**
 * Wait for an element with the given aria-label to appear, then click it.
 * Polls every 100ms for up to 2 seconds.
 */
function waitAndClick(label: string, maxWaitMs = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = findZoomElement(label);
      if (el) {
        simulateClick(el);
        resolve(true);
        return;
      }
      elapsed += interval;
      if (elapsed >= maxWaitMs) {
        console.warn(`[Zoom for Kids] Timed out waiting for: "${label}"`);
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
function waitForAndClick(selector: string, maxWaitMs = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const interval = 100;
    let elapsed = 0;

    const check = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        simulateClick(el);
        resolve(true);
        return;
      }
      elapsed += interval;
      if (elapsed >= maxWaitMs) {
        console.warn(`[Zoom for Kids] Timed out waiting for selector: "${selector}"`);
        resolve(false);
        return;
      }
      setTimeout(check, interval);
    };
    check();
  });
}

/**
 * Provides functions to interact with Zoom's web client control bar.
 *
 * All Zoom DOM interactions are contained here — components must not
 * query Zoom's DOM directly.
 */
export function useZoomControls() {
  const sendReaction = useCallback(async (emojiLabel: string): Promise<void> => {
    clickZoomElement('Reactions');
    await waitAndClick(emojiLabel);
  }, []);

  const sendClap = useCallback(() => sendReaction('clapping hands'), [sendReaction]);
  const sendThumbsUp = useCallback(() => sendReaction('thumbs up'), [sendReaction]);
  const sendHeart = useCallback(() => sendReaction('red heart'), [sendReaction]);
  const sendLaugh = useCallback(() => sendReaction('face with tears of joy'), [sendReaction]);
  const sendParty = useCallback(() => sendReaction('party popper'), [sendReaction]);
  const sendWow = useCallback(() => sendReaction('face with open mouth'), [sendReaction]);

  const raiseHand = useCallback(async (): Promise<void> => {
    // Open Reactions popup, then find raise-hand button by class (it has no aria-label)
    clickZoomElement('Reactions');
    await waitForAndClick('.reaction-simple-picker__block--raise-hand');
  }, []);

  const lowerHand = useCallback(async (): Promise<void> => {
    // Same button toggles raise/lower
    clickZoomElement('Reactions');
    await waitForAndClick('.reaction-simple-picker__block--raise-hand');
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
