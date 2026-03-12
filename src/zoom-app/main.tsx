import { createRoot } from 'react-dom/client';
import zoomSdk from '@zoom/appssdk';
import { ZoomApp } from './ZoomApp';

async function initZoomApp() {
  try {
    const configResponse = await zoomSdk.config({
      capabilities: [
        'getRunningContext',
        'setEmojiReaction',
        'getEmojiConfiguration',
        'setAudioState',
        'getAudioState',
        'onMyMediaChange',
        'onMeeting',
        'setFeedbackReaction',
        'removeFeedbackReaction',
        'onFeedbackReaction',
        'onRemoveFeedbackReaction',
      ],
      version: '0.16',
    });
    console.log('[Zoomi] SDK configured:', configResponse);
  } catch (err) {
    console.error('[Zoomi] SDK config failed:', err);
  }
}

async function main() {
  await initZoomApp();

  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');

  const root = createRoot(container);
  root.render(<ZoomApp />);
}

main();
