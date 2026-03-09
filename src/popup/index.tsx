import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

function Popup() {
  return (
    <main className="popup">
      <header className="popup-header">
        <span className="popup-icon" aria-hidden="true">🌟</span>
        <h1 className="popup-title">Zoom for Kids</h1>
      </header>
      <p className="popup-description">
        Big, easy buttons for Zoom — made for kids!
      </p>
      <p className="popup-tip">
        Join a Zoom meeting to see your kid-friendly controls.
      </p>
      <footer className="popup-footer">
        <span aria-hidden="true">👏 👍 ❤️ ✋ 🎤</span>
      </footer>
    </main>
  );
}

const root = document.getElementById('popup-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
