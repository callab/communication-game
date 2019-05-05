// Env vars should be configured in a .env file. This gets loaded in app.js
let env = process.env;

module.exports = {
  clientBundleName: 'bundle',
  port: env.NODE_ENV == 'production' ? 8080 : 3000,
  commitTag: env.APP_COMMIT || 'dev'
};
