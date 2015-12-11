var express = require('express');
var router = express.Router();

var auth = require('./authRoute');
var stocks = require('./stocksRoute');
var matches = require('./matchesRoute');
var users = require('./usersRoute');
var trades = require('./tradesRoute');

module.exports = function (knex, passport) {

  auth = auth(knex, passport);
  stocks = stocks(knex);
  matches = matches(knex);
  users = users(knex);
  trades = trades(knex);

  router.use('/auth', auth);
  router.use('/stocks', stocks);
  router.use('/matches', matches);
  router.use('/users', users);
  router.use('/trades', trades);

  return router;
};
