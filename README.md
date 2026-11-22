# CSS TextEffects builder

This is the source to a CSS text effects builder at

https://apps.josh.earth/texteffects/

## How it works

- Pick a preset or adjust the inspector on the right (Text, Stroke, Shadow). The preview and
  exports update live.
- Export the effect as CSS, as a PNG sprite sheet, or as a JS object (handy for adding presets).
- All state lives in the URL, so a link shares an effect and Back/Forward step through your edits.
- The UI is styled with [tooltheme](https://www.npmjs.com/package/@joshmarinacci/tooltheme), a
  classless CSS theme. It follows the system light/dark setting.

## Development

Requires Node 22.12 or newer.

```sh
npm install
npm start            # Vite dev server
npm test             # Vitest (run once); npm run test:watch to watch
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run format       # Prettier
npm run build        # type-check and production build into dist/
```

### Deploy (pm2)

The app is a static site, so no pm2 process runs. [`ecosystem.config.cjs`](ecosystem.config.cjs)
only defines a pm2 `deploy.production` target: it checks out the repo on the server, then runs
`npm ci && npm run build`. Point the web server at `<path>/current/dist`, served under
`/texteffects/` (the base path is set in `vite.config.ts`).

```sh
pm2 deploy ecosystem.config.cjs production setup     # first time: clone repo on the server
pm2 deploy ecosystem.config.cjs production           # every deploy after that
pm2 deploy ecosystem.config.cjs production revert 1  # roll back one release
```

Defaults, each overridable with an environment variable:

| Setting  | Default                               | Variable                   |
|----------|---------------------------------------|----------------------------|
| user     | `deployman`                           | `TEXTEFFECTS_DEPLOY_USER`  |
| host     | `josh.earth`                          | `TEXTEFFECTS_DEPLOY_HOST`  |
| SSH key  | `../deployman_private.key`            | `TEXTEFFECTS_DEPLOY_KEY`   |
| ref      | `origin/main`                         | `TEXTEFFECTS_DEPLOY_REF`   |
| path     | `/projects/css-texteffects-builder`   | `TEXTEFFECTS_DEPLOY_PATH`  |

The server needs Node 22.12 or newer (see `engines` in `package.json`).

Stack: React 19, TypeScript, Vite, Zod (the style schema drives the inspector form), react-color,
Vitest + React Testing Library. See [changes.md](changes.md) for the change log.

### Code map

- `src/model.ts`: the `StyleSchema` (Zod), font list, and CSS generation
- `src/autoform.tsx`: renders a Zod object schema as tooltheme property rows
- `src/App.tsx`: app shell (header / main / aside / footer) and inspector sections
- `src/presets.tsx`, `src/cssexport.tsx`, `src/pngexport.tsx`, `src/jsexport.tsx`: presets and exports
- `src/schema.ts`: URL and history-backed document state
- `src/App.css`: the few app-specific styles on top of tooltheme

## Notes

text properties

* base font
* font size
* font weight
* text color
* text outline width and color
* text shadow width and color and angle and blur

* react app, client side state only
* type in the sample text, choose the color, font, size, weight, shadows, etc.
* choose from a list of presets that I steal from other sites
* each gives you the generated CSS and or a bitmap spritesheet
* some buttons to generate random
* all state in the URL, get people to trade them and send them to me
* what font selection? just what’s in your browser for now. later look into google fonts
* base text color, bg color, shadow color, shadow size and angle
* get a common react color picker that doesn’t suck
* an evolve button that takes what you have and generates 16 variations to choose from, then repeat the process. not all properties are evolved.
* history in the browser url stack



