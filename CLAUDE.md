# CLAUDE.md — Zoom for Kids

This file documents the project architecture, development conventions, and workflows for AI assistants working on this codebase.

---

## Project Overview

**Zoom for Kids** is a browser extension (Chrome/Firefox) that injects a kid-friendly control panel into the Zoom web client (`zoom.us`). It provides large, colorful, easy-to-tap buttons for reactions, hand raise, and mute — making it easier for young children (ages 6–12) to participate in video calls.

### Core features
| Feature | Description |
|---|---|
| Emoji reactions | 6 big circular buttons triggering Zoom's built-in reaction system (👏 👍 ❤️ 😂 🎉 😮) |
| Hand raise / lower | Single large toggle button with pulsing yellow glow when active |
| Mute / unmute | Big pill button — green "I can talk" / red "I'm quiet" |

### Target platform
- **Chrome Extension** (Manifest V3), also compatible with Firefox via WebExtensions API
- Injected as a content script on `https://*.zoom.us/wc/*` (the Zoom web client meeting pages)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode) |
| UI framework | React 18 |
| Bundler | Vite + `vite-plugin-web-extension` |
| Styling | CSS Modules |
| Testing | Jest + React Testing Library |
| Linting | ESLint + Prettier |
| Package manager | npm |

---

## Repository Structure

```
zoom-for-kids/
├── public/
│   ├── manifest.json          # Chrome Manifest V3 config
│   └── icons/                 # Extension icons (16, 48, 128px) — add before publishing
├── src/
│   ├── vite-env.d.ts          # Vite client types + CSS module declarations
│   ├── content/               # Content script — injected into zoom.us
│   │   ├── index.tsx          # Entry point: mounts React app into a shadow DOM
│   │   └── content.css        # Base styles (box-sizing reset, button reset)
│   ├── components/            # Reusable React components
│   │   ├── App/
│   │   │   ├── App.tsx        # Floating panel — expand/collapse, routing to sub-components
│   │   │   └── App.module.css # Glassmorphism panel + minimized rocket button styles
│   │   ├── EmojiPanel/
│   │   │   ├── EmojiPanel.tsx
│   │   │   ├── EmojiPanel.module.css
│   │   │   └── EmojiPanel.test.tsx
│   │   ├── HandRaiseButton/
│   │   │   ├── HandRaiseButton.tsx
│   │   │   ├── HandRaiseButton.module.css
│   │   │   └── HandRaiseButton.test.tsx
│   │   └── MuteToggle/
│   │       ├── MuteToggle.tsx
│   │       ├── MuteToggle.module.css
│   │       └── MuteToggle.test.tsx
│   ├── hooks/
│   │   ├── useZoomControls.ts  # DOM-level integration with Zoom's control bar
│   │   └── useMeetingState.ts  # Observes Zoom meeting state via MutationObserver
│   ├── background/
│   │   └── index.ts            # Minimal Manifest V3 service worker
│   ├── popup/
│   │   ├── index.html          # Extension popup HTML
│   │   ├── index.tsx           # Popup React component (informational only)
│   │   └── popup.css           # Popup styles
│   └── types/
│       └── zoom.d.ts           # ZOOM_ARIA_LABELS constants + MeetingState type
├── tests/
│   ├── setup.ts               # Jest global setup (@testing-library/jest-dom)
│   └── __mocks__/
│       └── fileMock.ts        # Static asset stub for Jest
├── CLAUDE.md                  # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
├── jest.config.cjs            # Jest config (CJS — ts-node not required)
├── .eslintrc.cjs
└── .prettierrc
```

---

## Architecture

### Content Script Injection

The extension injects a floating panel into Zoom meeting pages using a **Shadow DOM** to prevent CSS conflicts with Zoom's own styles:

```
zoom.us meeting page
└── #zoom-kids-root (injected div, no styles)
    └── Shadow Root (mode: 'open')
        ├── <style> (injected by App.tsx useEffect — CSS as raw strings via ?inline)
        └── <div> (React mount point)
            └── <App /> (React tree)
                ├── <EmojiPanel />
                ├── <HandRaiseButton />
                └── <MuteToggle />
```

**Key rule:** Never manipulate the global `document` styles. All styles live inside the shadow root, injected via `?inline` CSS imports.

### CSS Injection into Shadow DOM

Because CSS Modules don't automatically scope into a shadow root, we use Vite's `?inline` query to import CSS as raw strings, then inject them with a `<style>` element:

```tsx
// In App.tsx
import appCss from './App.module.css?inline';
import contentCss from '../../content/content.css?inline';

useEffect(() => {
  const styleEl = document.createElement('style');
  styleEl.textContent = contentCss + '\n' + appCss;
  shadowRoot.insertBefore(styleEl, shadowRoot.firstChild);
}, [shadowRoot]);
```

The `?inline` declaration is in `src/vite-env.d.ts`.

### Zoom Control Integration

The extension interacts with Zoom's web client by:
1. **Querying DOM selectors** — Zoom's toolbar buttons have `aria-label` attributes. All selector strings are centralized in `src/types/zoom.d.ts`.
2. **MutationObserver** — `useMeetingState` observes DOM attribute changes to track mute and hand-raise state in real time.
3. **Programmatic click dispatch** — dispatching `MouseEvent` on Zoom's own buttons triggers their built-in logic.

```ts
// Pattern for triggering Zoom controls (from useZoomControls.ts)
function clickZoomButton(ariaLabel: string): boolean {
  const btn = document.querySelector<HTMLButtonElement>(`[aria-label="${ariaLabel}"]`);
  if (!btn) return false;
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
}
```

For reactions, the toolbar button opens a popup — a 350ms delay is used before clicking the emoji inside:

```ts
async function sendReaction(emojiAriaLabel: string) {
  clickZoomButton(ZOOM_ARIA_LABELS.REACTIONS_MENU);
  await delay(350);
  clickZoomButton(emojiAriaLabel);
}
```

**Important:** Zoom's DOM selectors may change between versions. Update `ZOOM_ARIA_LABELS` in `src/types/zoom.d.ts` if buttons stop working.

---

## UX/UI Design — Kids Ages 6–12

The visual design prioritizes simplicity, clarity, and delight for young children.

### Design Principles
- **Big targets** — emoji buttons 72×72px minimum, control buttons 64px tall full-width
- **Text + emoji always** — every button has both an emoji and a text label (supports early readers)
- **Unambiguous color coding** — green = good/active, red = muted/stop, yellow = hand up
- **Instant feedback** — every tap produces a visible scale animation
- **Minimize to stay out of the way** — panel collapses to a 56px rocket 🚀 button

### Color System
| State | Color | Usage |
|---|---|---|
| Unmuted | `#34d399` (green) | "I can talk" |
| Muted | `#ef4444` (red) | "I'm quiet" |
| Hand raised | `#fbbf24` (yellow) | "Hand Up!" with pulsing glow |
| Hand lowered | `rgba(100,116,139,0.5)` (slate) | "Raise Hand" |
| Clap reaction | `#f59e0b` | 👏 |
| Good reaction | `#22c55e` | 👍 |
| Love reaction | `#ef4444` | ❤️ |
| Funny reaction | `#f97316` | 😂 |
| Party reaction | `#8b5cf6` | 🎉 |
| Wow reaction | `#06b6d4` | 😮 |

### Panel Layout
```
┌────────────────────────────────┐
│  🌟 Zoom for Kids          [✕] │  ← Header
│  ─────────────────────────── │
│  React! 🎭                    │
│  [👏][👍][❤️]                  │  ← 3×2 emoji grid
│  [😂][🎉][😮]                  │
│  ─────────────────────────── │
│  [ ✋  Raise Hand           ]  │  ← Hand raise (gray/yellow)
│  [ 🎤  I can talk          ]  │  ← Mute toggle (green/red)
└────────────────────────────────┘
```

---

## Development Workflow

### Setup

```bash
npm install
```

### Development build (watch mode)

```bash
npm run dev
```

Outputs the unpacked extension to `dist/`. Load in Chrome via `chrome://extensions` → "Load unpacked" → select `dist/`.

### Production build

```bash
npm run build
```

### Tests

```bash
npm test              # run all tests
npm test -- --watch   # watch mode
npm test -- --coverage
```

### Linting & formatting

```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # tsc --noEmit
```

---

## Code Conventions

### TypeScript

- **Strict mode** is enabled (`"strict": true` in `tsconfig.json`). No `any` unless absolutely unavoidable and documented.
- Prefer `type` over `interface` for object shapes (use `interface` only when extending).
- With `react-jsx` transform, **do not import React** unless using a named export from React (e.g., `React.CSSProperties`). Importing React without using it causes a TS6133 error.
- Export types alongside their source files, not in a central `types/index.ts` (except for Zoom DOM declarations in `src/types/zoom.d.ts`).

### React

- **Functional components only** — no class components.
- Co-locate component CSS module and test file with the component (same directory).
- Component file names: `PascalCase.tsx`.
- Do not use default exports — use named exports for all components:
  ```ts
  // Good
  export function EmojiPanel({ ... }: EmojiPanelProps) { ... }

  // Avoid
  export default function EmojiPanel() { ... }
  ```

### CSS Modules

- Class names: `camelCase` in CSS Modules files.
- Never use global selectors inside `.module.css` files.
- Kid-friendly UI guidelines:
  - Minimum button size: `64px × 64px` (emoji buttons: `72px × 72px`)
  - Font size: minimum `1.1rem` for labels
  - High-contrast colors (see color system above)
  - Every interactive element: emoji icon + visible text label

### Hooks

- Custom hooks live in `src/hooks/`.
- Hook files: `useCamelCase.ts`.
- Hooks that interact with the DOM must clean up all event listeners and observers in their `useEffect` cleanup function.
- `useZoomControls` is the **single point of contact** with Zoom's DOM — components must not query Zoom's DOM directly.

### Testing

- Test files sit next to the component they test: `ComponentName.test.tsx`.
- Use `@testing-library/react` — test behavior, not implementation.
- Mock DOM interactions using `jest.fn()`.
- Each component must have at minimum:
  1. A render smoke test
  2. Tests for each interactive behavior (click, keyboard)
  3. Accessibility test (aria-label, aria-pressed)

### Naming

| Item | Convention | Example |
|---|---|---|
| Component files | PascalCase | `HandRaiseButton.tsx` |
| Hook files | camelCase prefixed `use` | `useZoomControls.ts` |
| CSS Module files | PascalCase `.module.css` | `MuteToggle.module.css` |
| Constants | UPPER_SNAKE_CASE | `ZOOM_ARIA_LABELS` |
| Type names | PascalCase | `MeetingState` |

---

## Extension Manifest (Manifest V3)

Key `manifest.json` fields to maintain:

```json
{
  "manifest_version": 3,
  "permissions": ["activeTab"],
  "host_permissions": ["https://*.zoom.us/wc/*"],
  "content_scripts": [
    {
      "matches": ["https://*.zoom.us/wc/*"],
      "js": ["src/content/index.tsx"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "src/background/index.ts"
  }
}
```

**Rules:**
- Request minimum permissions — `activeTab` only.
- Do not use `"<all_urls>"` in `host_permissions` — restrict to `*.zoom.us`.
- Icons must exist at the declared paths before publishing to Chrome Web Store.

---

## Accessibility Requirements

All interactive elements must:

- Have descriptive `aria-label` attributes
- Use `aria-pressed` for toggle buttons (hand raise, mute)
- Be keyboard-accessible (Tab / Enter / Space)
- Meet WCAG 2.1 AA contrast ratios
- Include visible focus indicators (white `outline` on `:focus-visible`)
- Never rely solely on color to convey state — always pair with icons + text

---

## Common Pitfalls

1. **Zoom DOM selectors break on Zoom updates** — if buttons stop working, check if `aria-label` values changed in the Zoom web client. Update `ZOOM_ARIA_LABELS` in `src/types/zoom.d.ts`.

2. **Shadow DOM and CSS Modules** — CSS Modules classes are injected as raw strings via `?inline` imports into the shadow root. If you add a new component with its own CSS, inject it through `App.tsx`'s `useEffect`. Declare new `?inline` imports are supported via `src/vite-env.d.ts`.

3. **Shadow DOM and React** — React's event system works correctly inside a shadow root when `{ mode: 'open' }` is used. Do not use `{ mode: 'closed' }`.

4. **Reaction popup timing** — Zoom's reactions popup takes ~300ms to appear after clicking the toolbar button. The 350ms delay in `useZoomControls.ts` accommodates this. If reactions become unreliable, increase this delay.

5. **Content script timing** — Zoom's controls are loaded dynamically. `useMeetingState` uses a `MutationObserver` and only renders the panel when `isMeetingActive` is true.

6. **CSP restrictions** — Zoom sets strict Content Security Policy headers. All assets must be loaded via `chrome-extension://` URLs. Do not attempt to load Google Fonts or any remote scripts.

7. **Jest config must be `.cjs`** — Jest requires `ts-node` for TypeScript config files. Use `jest.config.cjs` (CommonJS) to avoid this dependency. Do not rename it to `.ts`.

---

## Git Workflow

- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Commit style: imperative mood, present tense (e.g., `Add hand raise button component`)
- All PRs must pass `npm test`, `npm run lint`, and `npm run type-check` before merging
- Do not commit `dist/` — it is gitignored

---

## Environment Variables

This is a pure browser extension with no backend — there are no environment variables or API keys required.

---

*Last updated: 2026-03-09*
