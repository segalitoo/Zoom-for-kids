import { useCallback, useState } from 'react';
import zoomSdk from '@zoom/appssdk';

/**
 * Provides functions to interact with Zoom via the Zoom Apps SDK.
 * Drop-in replacement for useZoomControls (which uses DOM scraping).
 */
export function useZoomAppControls() {
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const log = (msg: string) => {
    setDebugLog((prev) => [...prev.slice(-4), msg]);
  };

  const sendReaction = useCallback(async (unicode: string, name: string, emoji: string) => {
    try {
      log(`Sending ${name}...`);
      const result = await zoomSdk.setEmojiReaction({ unicode, name, emoji });
      log(`OK: ${JSON.stringify(result)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      log(`ERR reaction: ${msg}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendClap = useCallback(() => sendReaction('U+1F44F', 'clap', '\u{1F44F}'), [sendReaction]);
  const sendThumbsUp = useCallback(() => sendReaction('U+1F44D', 'thumbsup', '\u{1F44D}'), [sendReaction]);
  const sendHeart = useCallback(() => sendReaction('U+2764 U+FE0F', 'heart', '\u{2764}\u{FE0F}'), [sendReaction]);
  const sendLaugh = useCallback(() => sendReaction('U+1F602', 'joy', '\u{1F602}'), [sendReaction]);
  const sendParty = useCallback(() => sendReaction('U+1F389', 'tada', '\u{1F389}'), [sendReaction]);
  const sendWow = useCallback(() => sendReaction('U+1F62E', 'open_mouth', '\u{1F62E}'), [sendReaction]);

  const raiseHand = useCallback(async () => {
    try {
      log('Raising hand...');
      const result = await zoomSdk.setFeedbackReaction({ feedback: 'raiseHand' });
      log(`OK raise: ${JSON.stringify(result)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      log(`ERR raise: ${msg}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lowerHand = useCallback(async () => {
    try {
      log('Lowering hand...');
      const result = await zoomSdk.removeFeedbackReaction();
      log(`OK lower: ${JSON.stringify(result)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      log(`ERR lower: ${msg}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = useCallback(async () => {
    try {
      log('Getting audio...');
      const state = await zoomSdk.getAudioState();
      log(`State=${JSON.stringify(state)}`);
      // audio: true = unmuted, false = muted. Toggle it.
      const result = await zoomSdk.setAudioState({ audio: !state.audio });
      log(`OK mute: ${JSON.stringify(result)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      log(`ERR mute: ${msg}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    debugLog,
  };
}
