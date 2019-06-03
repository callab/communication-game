// Env vars should be configured in a .env file. This gets loaded in app.js
let env = process.env;

module.exports = {
  clientBundleName: 'bundle',
  port: env.NODE_ENV == 'production' ? 8080 : 3000,
  commitTag: env.APP_COMMIT || 'dev',
  game: {
    digging_duration_ms: 5 * 1000,
    game_length_ms: 60 * 1000,
    fps: 30,
    players_per_game: 2
  }
};
