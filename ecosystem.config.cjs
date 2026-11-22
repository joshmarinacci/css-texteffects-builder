// pm2 deploy config for css-texteffects-builder. The app is a static site, so no pm2 process runs;
// pm2 deploy checks out the repo on the server and builds it.
//
//   pm2 deploy ecosystem.config.cjs production setup   # first time: clone repo on the server
//   pm2 deploy ecosystem.config.cjs production         # every deploy after that
//
// A deploy checks out `ref` into <path>/source (reached through <path>/current), installs
// dependencies and runs the production build. Point the web server at <path>/current/dist,
// served under /texteffects/ (the base path is set in vite.config.ts). The server needs Node
// 22.12+ (see "engines" in package.json).
// Override the defaults with the TEXTEFFECTS_DEPLOY_* variables.

module.exports = {
  apps: [],

  deploy: {
    production: {
      user: process.env.TEXTEFFECTS_DEPLOY_USER || 'deployman',
      host: [process.env.TEXTEFFECTS_DEPLOY_HOST || 'josh.earth'],
      key: process.env.TEXTEFFECTS_DEPLOY_KEY || '../deployman_private.key',
      ref: process.env.TEXTEFFECTS_DEPLOY_REF || 'origin/main',
      repo: 'https://github.com/joshmarinacci/css-texteffects-builder.git',
      path: process.env.TEXTEFFECTS_DEPLOY_PATH || '/projects/css-texteffects-builder',
      'post-deploy': 'npm ci && npm run build',
    },
  },
}
