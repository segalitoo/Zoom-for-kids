// Minimal Manifest V3 service worker.
// No persistent state is needed — the content script manages everything.
// This file satisfies the manifest requirement for a background service worker.

chrome.runtime.onInstalled.addListener(() => {
  // Extension installed or updated — no action needed
});
