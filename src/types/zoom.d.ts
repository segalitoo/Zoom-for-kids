/**
 * Centralized Zoom web client DOM selector constants.
 *
 * Zoom's aria-label values may change between Zoom web client releases.
 * Update these constants here if reactions or controls stop working after a Zoom update.
 */
export const ZOOM_ARIA_LABELS = {
  /** Toolbar button that opens the emoji reactions popup */
  REACTIONS_MENU: 'Reactions',

  /** Inside the reactions popup */
  CLAP: 'Clapping Hands',
  THUMBS_UP: 'Thumbs Up',
  HEART: 'Heart',
  LAUGH: 'Loudly Crying Face',
  PARTY: 'Party Popper',
  WOW: 'Open Hands',

  /** Hand raise / lower — inside the reactions popup */
  RAISE_HAND: 'Raise Hand',
  LOWER_HAND: 'Lower Hand',

  /** Mute / unmute toolbar buttons */
  MUTE: 'Mute my microphone',
  UNMUTE: 'Unmute my microphone',
} as const;

export type ZoomAriaLabel = (typeof ZOOM_ARIA_LABELS)[keyof typeof ZOOM_ARIA_LABELS];

/** Shape of the meeting state derived by observing Zoom's DOM */
export type MeetingState = {
  isMuted: boolean;
  isHandRaised: boolean;
  isMeetingActive: boolean;
  isLeaveDialogOpen: boolean;
};
