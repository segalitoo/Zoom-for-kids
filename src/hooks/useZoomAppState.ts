import { useState, useEffect } from 'react';
import zoomSdk from '@zoom/appssdk';
import { type MeetingState } from '../types/zoom.d';

/**
 * Tracks meeting state via the Zoom Apps SDK events.
 * Drop-in replacement for useMeetingState (which uses MutationObserver).
 */
export function useZoomAppState(): MeetingState {
  const [state, setState] = useState<MeetingState>({
    isMuted: false,
    isHandRaised: false,
    isMeetingActive: false,
  });

  useEffect(() => {
    async function init() {
      try {
        const ctx = await zoomSdk.getRunningContext();
        const inMeeting = ctx.context === 'inMeeting' || ctx.context === 'inWebinar';

        if (inMeeting) {
          const { audio } = await zoomSdk.getAudioState();
          setState({
            isMuted: !audio,
            isHandRaised: false, // No reliable API to query current hand state
            isMeetingActive: true,
          });
        } else {
          setState((prev) => ({ ...prev, isMeetingActive: false }));
        }
      } catch (err) {
        console.warn('[Zoomi] Failed to get initial state:', err);
      }
    }

    init();

    // Listen for audio changes (AudioMedia shape: { audio?: { state: boolean } })
    zoomSdk.onMyMediaChange((event) => {
      const audio = (event.media as { audio?: { state: boolean } }).audio;
      if (audio !== undefined) {
        setState((prev) => ({
          ...prev,
          isMuted: !audio.state,
        }));
      }
    });

    // Listen for feedback reactions (hand raise state)
    try {
      zoomSdk.onFeedbackReaction((event) => {
        // Track own hand raise state
        if (event.feedback === 'raiseHand') {
          setState((prev) => ({ ...prev, isHandRaised: true }));
        }
      });

      zoomSdk.onRemoveFeedbackReaction(() => {
        setState((prev) => ({ ...prev, isHandRaised: false }));
      });
    } catch {
      // Feedback reaction events may not be supported
      console.warn('[Zoomi] Feedback reaction events not available');
    }

    // Listen for meeting state changes
    zoomSdk.onMeeting((event) => {
      if (event.action === 'ended') {
        setState({ isMuted: false, isHandRaised: false, isMeetingActive: false });
      }
    });
  }, []);

  return state;
}
