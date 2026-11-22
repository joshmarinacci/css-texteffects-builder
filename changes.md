# Changes

## 2026-11-22 (later)

- Updated `@joshmarinacci/tooltheme` 0.1.1 → 0.1.2, which fixes switch rows rendering toggle-first.
- Removed the switch-row workaround from `src/App.css`.
- Restored the `allowScripts` approval for `fsevents@2.3.3`, removed by mistake in the earlier dependency update (the stale `esbuild@0.21.5` entry stays removed).

## 2026-11-22

Updated dependencies and restyled the app with @joshmarinacci/tooltheme.

Dependencies:
- `react`/`react-dom` 18 → 19, `zod` 3 → 4 (fixes GHSA-mrhx-c7xc-m3w5), `vitest`/`@vitest/coverage-v8` 4 → 5, `jsdom` 24 → 31, `@testing-library/jest-dom` 6 → 8, `@types/node` 20 → 22, plus in-range bumps (vite 8.3.8 fixes its 8.2.x advisories). `npm audit`: 0 vulnerabilities.
- Removed `josh_react_util` (pinned to React 18; its HBox/VBox/TabbedPanel are replaced by semantic HTML).
- Added ESLint (flat config, typescript-eslint, react-hooks) and Prettier; added `lint`, `typecheck`, `format` scripts.
- TypeScript stays on 5.9: typescript-eslint does not support TS 7 yet.
- Node ≥ 22.12 required (vitest 5, jsdom 31). CI now runs Node 24, lints, and uses `vitest run`.

UI:
- App shell via tooltheme (`#root[data-shell]`): header, preview + export in `main`, inspector in `aside`, status bar footer. Follows system light/dark.
- Inspector is grouped into Presets / Text / Stroke / Shadow panels with labelled property rows; booleans are switches.
- Color fields open an inline react-color SketchPicker (replaces the Swatches/Photoshop popover, which did not fit the inspector). Escape closes it.
- Export tabs are now `<details>` panels.
- Sliders announce their real value via `aria-valuetext` (fractional sliders are scaled internally).

Fixes:
- Restoring state from browser history no longer pushes a new history entry (Back/Forward were broken).

## 2026-08-10 16:20

Updated Vite, Vitest, and @vitejs/plugin-react to latest versions to fix esbuild vulnerability (GHSA-67mh-4wv8-2f99).

- Bumped `vite` 5 → 8, `vitest` 2 → 4, `@vitejs/plugin-react` 4 → 6
- Added `"type": "module"` to package.json for Vite 8 ESM compatibility
- Switched `vite.config.ts` to import from `vitest/config` (fixes TypeScript error for `test` property)
- Replaced `__dirname` with `import.meta.dirname` in vite.config.ts
- Pinned `josh_react_util` to `1.0.26` — `TabbedPanel` was removed from exports in newer versions
- Updated `josh_react_util` alias to `lib/esm/index.js` (v1.0.26's path)

## 2026-08-08 13:20

Migrated from Create React App (deprecated) to Vite + Vitest.

- Replaced `react-scripts` with `vite`, `@vitejs/plugin-react`, and `vitest`
- Added `vite.config.ts` with React plugin and Vitest jsdom test environment
- Moved `public/index.html` to project root; replaced `%PUBLIC_URL%` refs with plain paths and added `<script type="module">` entry point
- Updated `tsconfig.json`: target `ESNext`, `moduleResolution: bundler`
- Removed CRA-specific files: `src/reportWebVitals.ts`
- Updated `src/react-app-env.d.ts` to reference `vite/client` instead of `react-scripts`
- Fixed `App.test.tsx` placeholder (old test checked for "learn react" text that doesn't exist)
- Added resolve aliases in `vite.config.ts` to work around issues in local packages:
  - `josh_react_util` CJS build is missing CSS files; aliased to its ESM build
  - `josh_web_util` has no `"main"` field; aliased directly to `dist/index.js`
