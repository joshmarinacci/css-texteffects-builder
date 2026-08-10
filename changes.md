# Changes

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
