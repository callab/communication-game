const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');

module.exports = function configure(app) {
  configureTemplateEngine(app);
  configureMiddleware(app);
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
