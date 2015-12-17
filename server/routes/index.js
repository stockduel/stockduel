var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var auth = require('./authRoute');
var stocks = require('./stocksRoute');
var matches = require('./matchesRoute');
var users = require('./usersRoute');
var trades = require('./tradesRoute');
var state = require('./stateRoute');

var passport = require('./auth/index');

module.exports = function (knex) {

  var router = express.Router();

  router.use(express.static('public'));
  router.use(cookieParser());
  router.use(bodyParser());
  router.use(session({
    secret: 'stockDuel',
    resave: false,
    saveUninitialized: true
  }));
  router.use(passport.initialize());
  router.use(passport.session());

  auth = auth(knex, passport);
  stocks = stocks(knex);
  matches = matches(knex);
  users = users(knex);
  trades = trades(knex);
  state = state(knex);

  router.use('/auth', auth);
  router.use('/stocks', stocks);
  router.use('/matches', matches);
  router.use('/users', users);
  router.use('/trades', trades);
  router.use('/state', state);

  return router;
};
