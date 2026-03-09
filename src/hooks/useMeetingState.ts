import { useState, useEffect } from 'react';
import { ZOOM_ARIA_LABELS, type MeetingState } from '../types/zoom.d';


function getIsMuted(): boolean {
  // Muted = unmute button visible; unmuted = mute button visible
  return !!document.querySelector(`[aria-label="${ZOOM_ARIA_LABELS.UNMUTE}"]`);
}

function getIsHandRaised(): boolean {
  return !!document.querySelector(`[aria-label="${ZOOM_ARIA_LABELS.LOWER_HAND}"]`);
}

function getIsMeetingActive(): boolean {
  // Zoom's toolbar appears when meeting is active
  return !!(
    document.querySelector(`[aria-label="${ZOOM_ARIA_LABELS.MUTE}"]`) ||
    document.querySelector(`[aria-label="${ZOOM_ARIA_LABELS.UNMUTE}"]`)
  );
}

/**
 * Observes the Zoom meeting DOM via MutationObserver to track real-time state.
 * Cleans up the observer on unmount.
 */
export function useMeetingState(): MeetingState {
  const [state, setState] = useState<MeetingState>({
    isMuted: false,
    isHandRaised: false,
    isMeetingActive: false,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function updateState() {
      setState({
        isMuted: getIsMuted(),
        isHandRaised: getIsHandRaised(),
        isMeetingActive: getIsMeetingActive(),
      });
    }

    const observer = new MutationObserver(updateState);

    function startObserving() {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label', 'aria-pressed', 'class'],
      });
      updateState();
    }

    if (document.body) {
      startObserving();
    } else {
      // Fallback: wait for body to be available
      timeoutId = setTimeout(startObserving, 500);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}
