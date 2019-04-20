const express = require('express'),
      exphbs = require('express-handlebars'),
      morgan = require('morgan');

const app = express();
const port = 3000;

const expressWs = require('express-ws')(app);

const gameRouter = require('./routes/game');

let hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.static('public'));

app.use('/game', gameRouter);

app.get('/', (req, res) => {
  let path = '/game';
  res.render('index', { path: path });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
