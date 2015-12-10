var stocks = require('../schema/stockSchema');
var stockprices = require('../schema/stockPriceSchema');
var stockpricesArchive = require('../schema/stockPriceArchiveSchema');
var matches = require('../schema/matchesSchema');
var trades = require('../schema/tradesSchema');
var users = require('../schema/usersSchema');

exports.up = function (knex, Promise) {
  return Promise.all([
    stocks(knex),
    stockprices(knex),
    stockpricesArchive(knex),
    matches(knex),
    trades(knex),
    users(knex)
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('stock_prices'),
    knex.schema.dropTable('stock_prices_archive'),
    knex.schema.dropTable('stocks'),
    knex.schema.dropTable('matches'),
    knex.schema.dropTable('trades'),
    knex.schema.dropTable('users')
  ]);
};
