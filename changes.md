# Changes

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
