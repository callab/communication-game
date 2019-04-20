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
  let date = new Date(Date.now());
  res.render('index', { date: date.toDateString() });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
