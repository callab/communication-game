const express = require('express');
const configure = require('./config');

const app = express();
const port = 3000;

configure(app);

const expressWs = require('express-ws')(app);

const gameRouter = require('./routes/game');
app.use('/game', gameRouter);

// Log errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.get('/', (req, res) => {
  let path = '/game';
  res.render('index', { path: path });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
