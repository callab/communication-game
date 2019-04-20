const express = require('express'),
      exphbs = require('express-handlebars'),
      morgan = require('morgan');

const app = express();
const port = 3000;

let hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  let path = '/game';
  res.render('index', { path: path });
});

app.get('/game', (req, res) => {
  res.render('game');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
