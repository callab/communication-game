const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

let hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  let date = new Date(Date.now());
  res.render('index', { date: date.toDateString() });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
