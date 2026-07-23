# Shared: Theme

Light/dark theme, user-toggleable, persisted, defaulting to the OS
preference on first visit. Follows the same
domain/application/infrastructure/presentation shape as `blog` — see
[11-shared-services.md](../11-shared-services.md) for why a `shared/`
concern still gets the full treatment when it has real state.

## Domain

```
src/shared/theme/domain/
  value-objects/
    Theme.valueObject.ts
  repositories/
    Theme.repository.ts
```

**`Theme`** wraps a `ThemeMode` (`'light' | 'dark'`) — `Theme.create(mode)`
validates, `Theme.light()`/`Theme.dark()` are the two named instances,
`toggle()` returns the other one (immutable, like any value object),
`equals()`/`toString()` round it out. **`ThemeRepository`** (port) is
four methods, not the usual two — this concern genuinely needs both a
persistence half and a browser-environment-reading half:
`getPersisted()` / `persist(theme)` (survive a reload) and
`getSystemPreference()` / `apply(theme)` (read the OS setting, and push
the resolved theme onto the DOM so CSS can react to it).

## Application

`src/shared/theme/application/Theme.stateService.ts` — no separate
`Theme.readService.ts`: there's no query, just one signal
(`theme: Signal<Theme>`) and two actions. `initialize()` resolves
`getPersisted() ?? getSystemPreference()` and applies it;`toggle()` flips
the current value. Both funnel through a private `setTheme()` that
updates the signal, persists, and applies together, so those three never
drift out of sync.

## Infrastructure

`src/shared/theme/infrastructure/BrowserTheme.repository.ts` —
`BrowserThemeRepository`, the only `ThemeRepository` adapter. Persistence
is `window.localStorage` under the key `staretz:theme`; system preference
is `window.matchMedia('(prefers-color-scheme: dark)')`; applying a theme
toggles the `dark` class on `document.documentElement`. Explicit
`window.` prefixes (not bare `localStorage`/`matchMedia`) matter here —
see [the test-setup note](#tests) below.

## Presentation

```
src/shared/presentation/
  ThemeToggle.component.tsx
  useThemeState.hook.ts
  icons/
    PixelIcon.component.tsx
    PixelSunIcon.component.tsx
    PixelMoonIcon.component.tsx
```

`useThemeState()` follows the standard hook shape (pull the state
service from `container`, `useEffect` → `initialize()` on mount, return
`{ theme, toggle }`). `ThemeToggle` is a small self-contained widget in
the header — it calls the hook directly rather than splitting into a
container/component pair, the same pragmatic exception `NotificationCenter`
takes (see
[shared-notifications.md](shared-notifications.md#presentation)) — a
route-level loading/error/loaded split doesn't apply to a toggle button
with no async load. The sun/moon glyphs are hand-built pixel-art SVGs
(`PixelIcon` renders a bitmap — a `string[]` of `'0'`/`'1'` rows — as a
grid of `<rect>`s with `shape-rendering="crispEdges"`) rather than a new
icon-library dependency.

### Avoiding a flash of the wrong theme

Applying the theme only from `useThemeState`'s `useEffect` would mean a
dark-preferring user sees a flash of the light theme on every load (JS
runs after first paint). [`index.html`](../../index.html) has a small
blocking inline `<script>` in `<head>`, before any app code, that reads
`localStorage`/`matchMedia` itself and sets the `dark` class
synchronously. `BrowserThemeRepository`/`ThemeStateServiceImpl.initialize()`
then just reconciles the signal with whatever the bootstrap script
already applied — `apply()` is idempotent, so this never double-toggles.

### Tailwind's `dark:` variant is class-based, not OS-based

[`index.css`](../../src/index.css) declares
`@custom-variant dark (&:where(.dark, .dark *));` (Tailwind v4) so every
`dark:` utility across the app reacts to the `.dark` class the theme
module controls, instead of the browser's `prefers-color-scheme` media
query directly — otherwise a manual toggle would have no visible effect
for a user whose OS is already in light mode.

### Layout is full-width; reading pages re-center themselves

`Layout` (`bg-white dark:bg-black`) and `Header`/`Footer` span the full
viewport width with responsive padding, no `max-w-*`. Screens that read
as prose — the post view (`blog.md`), `about`, 404 — each wrap their own
content in `mx-auto max-w-3xl` instead, so the outer shell can be wide
(supporting the blog's multi-column card grid) while the reading
experience for that content stays a comfortable line length.

## DI wiring

`ThemeRepository` → `ThemeStateService` (needs `ThemeRepository`), both
`.inSingletonScope()`. Symbols:
`ThemeRepository`, `ThemeStateService`.

## Tests

```
domain/value-objects/__tests__/    Theme.valueObject.test.ts
application/__tests__/             Theme.stateService.test.ts (mocked ThemeRepository)
infrastructure/__tests__/          BrowserTheme.repository.test.ts (real jsdom localStorage/matchMedia)
```

`BrowserTheme.repository.test.ts` needs a working `window.localStorage`
and `window.matchMedia` under jsdom, which Node 22+'s own native
(and, without a `--localstorage-file`, non-functional) global
`localStorage` shadows, and which jsdom never implements at all for
`matchMedia`. [`src/test-setup.ts`](../../src/test-setup.ts) (wired via
`vite.config.ts`'s `test.setupFiles`) polyfills both once, globally.
