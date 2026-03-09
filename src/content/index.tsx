import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../components/App/App';

/**
 * Injects the Zoom for Kids panel into the page using a Shadow DOM.
 * Shadow DOM isolates our styles from Zoom's own CSS.
 */
function injectPanel(): void {
  // Prevent duplicate injection
  if (document.getElementById('zoom-kids-root')) return;

  const hostEl = document.createElement('div');
  hostEl.id = 'zoom-kids-root';
  // No styles on the host element — everything lives inside the shadow root
  document.body.appendChild(hostEl);

  const shadowRoot = hostEl.attachShadow({ mode: 'open' });

  // Mount point for React
  const mountPoint = document.createElement('div');
  shadowRoot.appendChild(mountPoint);

  const root = createRoot(mountPoint);
  root.render(
    <React.StrictMode>
      <App shadowRoot={shadowRoot} />
    </React.StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectPanel);
} else {
  injectPanel();
}
