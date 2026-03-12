import { useCallback } from 'react';
import zoomSdk from '@zoom/appssdk';

/**
 * Provides functions to interact with Zoom via the Zoom Apps SDK.
 * Drop-in replacement for useZoomControls (which uses DOM scraping).
 */
export function useZoomAppControls() {
  const sendReaction = useCallback(async (unicode: string, name: string) => {
    try {
      await zoomSdk.setEmojiReaction({ unicode, name });
    } catch (err) {
      console.warn('[Zoomi] Failed to send reaction:', err);
    }
  }, []);

  const sendClap = useCallback(() => sendReaction('U+1F44F', 'clap'), [sendReaction]);
  const sendThumbsUp = useCallback(() => sendReaction('U+1F44D', 'thumbsup'), [sendReaction]);
  const sendHeart = useCallback(() => sendReaction('U+2764 U+FE0F', 'heart'), [sendReaction]);
  const sendLaugh = useCallback(() => sendReaction('U+1F602', 'joy'), [sendReaction]);
  const sendParty = useCallback(() => sendReaction('U+1F389', 'tada'), [sendReaction]);
  const sendWow = useCallback(() => sendReaction('U+1F62E', 'open_mouth'), [sendReaction]);

  const raiseHand = useCallback(async () => {
    try {
      await zoomSdk.setFeedbackReaction({ feedback: 'raiseHand' });
    } catch (err) {
      console.warn('[Zoomi] Raise hand may not be supported:', err);
    }
  }, []);

  const lowerHand = useCallback(async () => {
    try {
      await zoomSdk.removeFeedbackReaction();
    } catch (err) {
      console.warn('[Zoomi] Lower hand may not be supported:', err);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    try {
      const { audio } = await zoomSdk.getAudioState();
      await zoomSdk.setAudioState({ audio: !audio });
    } catch (err) {
      console.warn('[Zoomi] Failed to toggle mute:', err);
    }
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
