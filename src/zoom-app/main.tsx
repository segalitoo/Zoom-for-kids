import { createRoot } from 'react-dom/client';
import zoomSdk from '@zoom/appssdk';
import { ZoomApp } from './ZoomApp';

async function initZoomApp(): Promise<{ success: boolean; error?: string }> {
  try {
    const configResponse = await zoomSdk.config({
      capabilities: [
        // APIs — must match Marketplace > Surface > Zoom App SDK selections
        'getRunningContext',
        'setEmojiReaction',
        'setFeedbackReaction',
        'removeFeedbackReaction',
        'getAudioState',
        'setAudioState',
        // Events
        'onIncomingParticipantAudioChange',
        'onFeedbackReaction',
        'onRemoveFeedbackReaction',
        'onMeeting',
      ],
      version: '0.16',
    });
    console.log('[Zoomi] SDK configured:', configResponse);
    return { success: true };
  } catch (err) {
    console.error('[Zoomi] SDK config failed:', err);
    return { success: false, error: String(err) };
  }
}

async function main() {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');

  const root = createRoot(container);

  const result = await initZoomApp();
  root.render(<ZoomApp sdkReady={result.success} sdkError={result.error} />);
}

main();
