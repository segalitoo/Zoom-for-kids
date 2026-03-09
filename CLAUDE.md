# CLAUDE.md — Zoom for Kids

This file documents the project architecture, development conventions, and workflows for AI assistants working on this codebase.

---

## Project Overview

**Zoom for Kids** is a browser extension (Chrome/Firefox) that injects a kid-friendly control panel into the Zoom web client (`zoom.us`). It provides large, colorful, easy-to-tap buttons for reactions, hand raise, and mute — making it easier for young children to participate in video calls.

### Core features
| Feature | Description |
|---|---|
| Emoji reactions | Large buttons triggering Zoom's built-in reaction system (clap, thumbs up, heart, etc.) |
| Hand raise / lower | Single large toggle button with clear visual state |
| Mute / unmute | Big mute toggle with visible status indicator |

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
│   └── icons/                 # Extension icons (16, 48, 128px)
├── src/
│   ├── content/               # Content script — injected into zoom.us
│   │   ├── index.tsx          # Entry point: mounts React app into a shadow DOM
│   │   └── content.css        # Base styles scoped to the injected panel
│   ├── components/            # Reusable React components
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
│   │   └── index.ts            # Service worker (Manifest V3 background script)
│   ├── popup/
│   │   ├── index.tsx           # Extension popup shown when clicking the toolbar icon
│   │   └── popup.css
│   └── types/
│       └── zoom.d.ts           # TypeScript type declarations for Zoom DOM selectors
├── tests/
│   └── setup.ts               # Jest global setup (jsdom, testing-library config)
├── CLAUDE.md                  # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.cjs
└── .prettierrc
```

---

## Architecture

### Content Script Injection

The extension injects a floating panel into Zoom meeting pages using a **Shadow DOM** to prevent CSS conflicts with Zoom's own styles:

```
zoom.us meeting page
└── #zoom-kids-root (injected div)
    └── Shadow Root
        └── <App /> (React tree)
            ├── <EmojiPanel />
            ├── <HandRaiseButton />
            └── <MuteToggle />
```

**Key rule:** Never manipulate the global `document` styles. All styles must be scoped inside the shadow root.

### Zoom Control Integration

The extension interacts with Zoom's web client by:
1. **Querying DOM selectors** — Zoom's toolbar buttons have `aria-label` attributes (e.g., `[aria-label="Reactions"]`, `[aria-label="Mute"]`). Use these as selectors (more stable than class names).
2. **MutationObserver** — used in `useMeetingState` to detect when the meeting is active and when Zoom's controls are available in the DOM.
3. **Programmatic click dispatch** — dispatching `MouseEvent` on Zoom's own buttons is the safest approach (avoids re-implementing Zoom's logic).

```ts
// Pattern for triggering Zoom controls
function clickZoomButton(ariaLabel: string): void {
  const btn = document.querySelector<HTMLButtonElement>(
    `[aria-label="${ariaLabel}"]`
  );
  btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
```

**Important:** Zoom's DOM selectors may change between versions. Selector strings are centralized in `src/types/zoom.d.ts` and `src/hooks/useZoomControls.ts` — never hardcode them in components.

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

Outputs the unpacked extension to `dist/`. Load it in Chrome via `chrome://extensions` → "Load unpacked" → select `dist/`.

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
- Export types alongside their source files, not in a central `types/index.ts` (except for Zoom DOM declarations).

### React

- **Functional components only** — no class components.
- Co-locate component CSS module and test file with the component (same directory).
- Component file names: `PascalCase.tsx`.
- Prefer explicit `React.FC` typing only when the component accepts children via `PropsWithChildren`.
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
  - Minimum button size: `64px × 64px`
  - Font size: minimum `1.25rem`
  - High-contrast colors with accessible focus rings
  - Emoji icons should be supplemented with visible text labels

### Hooks

- Custom hooks live in `src/hooks/`.
- Hook files: `useCamelCase.ts`.
- Hooks that interact with the DOM must clean up all event listeners and observers in their `useEffect` cleanup function.
- `useZoomControls` is the single point of contact with Zoom's DOM — components should not query Zoom's DOM directly.

### Testing

- Test files sit next to the component they test: `ComponentName.test.tsx`.
- Use `@testing-library/react` — test behavior, not implementation.
- Mock DOM interactions with Zoom's buttons using `jest.fn()` and `document.querySelector` mocks.
- Each component must have at minimum:
  1. A render smoke test
  2. Tests for each interactive behavior (click, keyboard)
  3. Accessibility test (visible labels, role attributes)

### Naming

| Item | Convention | Example |
|---|---|---|
| Component files | PascalCase | `HandRaiseButton.tsx` |
| Hook files | camelCase prefixed `use` | `useZoomControls.ts` |
| CSS Module files | PascalCase `.module.css` | `MuteToggle.module.css` |
| Constants | UPPER_SNAKE_CASE | `ZOOM_ARIA_LABELS` |
| Type/Interface names | PascalCase | `EmojiReaction` |

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
  },
  "action": {
    "default_popup": "src/popup/index.html"
  }
}
```

**Rules:**
- Request the minimum permissions necessary — `activeTab` only; avoid `tabs` or `storage` unless a new feature explicitly requires it.
- Do not use `"<all_urls>"` in `host_permissions` — restrict to `*.zoom.us`.

---

## Accessibility Requirements

This app is designed for children. All interactive elements must:

- Have descriptive `aria-label` attributes
- Be keyboard-accessible (Tab / Enter / Space)
- Meet WCAG 2.1 AA contrast ratios
- Include visible focus indicators
- Not rely solely on color to convey state (use icons + text)

---

## Common Pitfalls

1. **Zoom DOM selectors break on Zoom updates** — if buttons stop working, check if `aria-label` values changed in the Zoom web client. Update `ZOOM_ARIA_LABELS` constants in `useZoomControls.ts`.

2. **Shadow DOM and React portals** — React's event system works correctly inside a shadow root when the root is created with `{ mode: 'open' }`. Do not use `{ mode: 'closed' }`.

3. **Content script timing** — Zoom's controls are loaded dynamically after the meeting page mounts. Use a `MutationObserver` with a timeout fallback (see `useMeetingState.ts`) rather than querying the DOM immediately on injection.

4. **CSP restrictions** — Zoom sets strict Content Security Policy headers. All extension assets must be loaded via `chrome-extension://` URLs; do not attempt to load remote scripts.

5. **Firefox compatibility** — Firefox does not support Manifest V3's `service_worker` in background. If Firefox support is added, a `browser_specific_settings` field and conditional background config will be needed.

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
