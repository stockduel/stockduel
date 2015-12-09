var express = require('express');
var router = express.Router();

var auth = require('./authRoute');
var stocks = require('./stocksRoute');
var matches = require('./matchesRoute');
var users = require('./usersRoute');

module.exports = function (knex) {

  auth = auth(knex);
  stocks = stocks(knex);
  matches = matches(knex);
  users = users(knex);

  router.use('/auth', auth);
  router.use('/stocks', stocks);
  router.use('/matches', matches);
  router.use('/users', users);

  return router;
};
