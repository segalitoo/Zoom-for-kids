import { useCallback } from 'react';
import { ZOOM_ARIA_LABELS } from '../types/zoom.d';

const REACTION_POPUP_DELAY_MS = 350;

function clickZoomButton(ariaLabel: string): boolean {
  const btn = document.querySelector<HTMLButtonElement>(`[aria-label="${ariaLabel}"]`);
  if (!btn) return false;
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Provides functions to interact with Zoom's web client control bar.
 *
 * All Zoom DOM interactions are contained here — components must not
 * query Zoom's DOM directly.
 */
export function useZoomControls() {
  const sendReaction = useCallback(async (emojiAriaLabel: string): Promise<void> => {
    // Open the reactions popup first
    clickZoomButton(ZOOM_ARIA_LABELS.REACTIONS_MENU);
    // Wait for Zoom's popup animation to complete
    await delay(REACTION_POPUP_DELAY_MS);
    // Click the specific emoji inside the popup
    clickZoomButton(emojiAriaLabel);
  }, []);

  const sendClap = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.CLAP), [sendReaction]);
  const sendThumbsUp = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.THUMBS_UP), [sendReaction]);
  const sendHeart = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.HEART), [sendReaction]);
  const sendLaugh = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.LAUGH), [sendReaction]);
  const sendParty = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.PARTY), [sendReaction]);
  const sendWow = useCallback(() => sendReaction(ZOOM_ARIA_LABELS.WOW), [sendReaction]);

  const raiseHand = useCallback(async (): Promise<void> => {
    clickZoomButton(ZOOM_ARIA_LABELS.REACTIONS_MENU);
    await delay(REACTION_POPUP_DELAY_MS);
    clickZoomButton(ZOOM_ARIA_LABELS.RAISE_HAND);
  }, []);

  const lowerHand = useCallback(async (): Promise<void> => {
    clickZoomButton(ZOOM_ARIA_LABELS.REACTIONS_MENU);
    await delay(REACTION_POPUP_DELAY_MS);
    clickZoomButton(ZOOM_ARIA_LABELS.LOWER_HAND);
  }, []);

  const toggleMute = useCallback((): void => {
    // Try unmute first; if no unmute button, try mute
    const unmuted = clickZoomButton(ZOOM_ARIA_LABELS.UNMUTE);
    if (!unmuted) clickZoomButton(ZOOM_ARIA_LABELS.MUTE);
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
