const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const generateId = require('./lib/generate-id');
const fixtures = require('./test/fixtures');

// Configurations
app.use(express.static('static'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.locals.title = 'Pizza Express';
app.locals.pizzas = {pizza: fixtures.validPizza};

// Routes
app.get('/', (request, response) => {
  response.render('index');
});

app.post('/pizzas', (request, response) => {
  if (!request.body.pizza) { return response.sendStatus(400); }

  var id = generateId();
  app.locals.pizzas[id] = request.body.pizza;
  console.log('IN POST', app.locals.pizzas)
  response.redirect('/pizzas/' + id);
});

app.get('/pizzas/:id', (request, response) => {
  var pizza = app.locals.pizzas[request.params.id];

  console.log(app.locals.pizzas, request.params.id)
  response.render('pizza', { pizza: pizza });
});


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;

