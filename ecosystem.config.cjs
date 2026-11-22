// pm2 config: serves the static production build in dist/.
// Build first (`npm run build`), then `npm run deploy`.
// CommonJS (.cjs) because package.json sets "type": "module".
module.exports = {
  apps: [
    {
      name: 'css-texteffects-builder',
      // pm2's built-in static file server
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: process.env.PORT || 4173,
        // Unknown paths fall back to index.html
        PM2_SERVE_SPA: 'true',
      },
    },
  ],
}
