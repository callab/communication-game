const express = require('express');
const configure = require('./config');
const gameRouter = require('./routes/game');
const sessionRouter = require('./routes/session');

const port = 3000;
const app = express();
configure(app);

const expressWs = require('express-ws')(app);

app.use('/game', gameRouter(app));
app.use('/login', sessionRouter(app));

// Log errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.get('/', (req, res) => {
  let path = '/game';
  res.render('index', { path: path });
});

app.get('/flash', (req, res) => {
  req.flash('info', 'This is a flash message!');
  res.redirect('/');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
