import { useState, useEffect } from 'react';
import { type MeetingState } from '../types/zoom.d';


function findByAriaLabelContaining(text: string): Element | null {
  return document.querySelector(`[aria-label*="${text}"]`);
}

function getIsMuted(): boolean {
  return !!findByAriaLabelContaining('unmute my microphone');
}

function getIsHandRaised(): boolean {
  return !!findByAriaLabelContaining('Lower hand');
}

function getIsMeetingActive(): boolean {
  // Only activate inside the meeting iframe where toolbar buttons exist.
  // Check for the meeting footer/toolbar or video elements.
  return !!(
    findByAriaLabelContaining('unmute my microphone') ||
    findByAriaLabelContaining('mute my microphone')
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
