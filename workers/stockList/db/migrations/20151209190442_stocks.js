var stocks = require('../schema/stockSchema');
var stockprices = require('../schema/stockPriceSchema');
var stockpricesArchive = require('../schema/stockPriceArchiveSchema');

exports.up = function (knex, Promise) {
  return Promise.all([
    stocks(knex),
    stockprices(knex),
    stockpricesArchive(knex)
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('stocks'),
    knex.schema.dropTable('stock_prices'),
    knex.schema.dropTable('stock_prices_archive')
  ]);
};
