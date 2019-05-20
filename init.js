const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const DB = require('./db.js');
const Game = require('./lib/game.js');
const sessionLogger = require('./middleware/session-logger');

module.exports = function init(app, config) {
  app.config = config;

  initDatabase(app);
  initTemplateEngine(app);
  initAuth(app);
  initMiddleware(app);
  initGame(app);
}

function initDatabase(app) {
  app.db = new DB({
    filename: 'store.db'
  });
}

function initTemplateEngine(app) {
  let hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      commitTag: () => app.config.commitTag
    }
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
}

function initAuth(app) {
  passport.use(new LocalStrategy((username, password, done) => {
    console.log('Verify callback.');

    app.db.findUserByEmail(username, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (!user.doesMatchPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('Deserializing user with id: ' + id);
    app.db.findUser(id, (err, user) => {
      console.log('Found user:');
      console.log(user);
      done(err, user);
    });
  });

  app.passport = passport;
}

function initMiddleware(app) {
  app.use(morgan('dev'));
  app.use(express.static('public'));
  app.use(express.urlencoded({
    extended: false
  }));

  app.use(session({
    secret: 'foo-bar',
    saveUninitialized: false, // Don't store new unmodified sessions
    resave: false             // Don't force store to save unmodified sessions
  }));

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

//  app.use(sessionLogger());
}

function initGame(app) {
  app.game = new Game();
}
