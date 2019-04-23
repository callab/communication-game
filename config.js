const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const DB = require('./db.js');

module.exports = function configure(app) {
  configureTemplateEngine(app);
  configureMiddleware(app);
  configureDatabase(app);
}

function configureTemplateEngine(app) {
  let hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs'
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
}

function configureMiddleware(app) {
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
}

function configureDatabase(app) {
  app.db = new DB({
    filename: 'store.db'
  });
}
