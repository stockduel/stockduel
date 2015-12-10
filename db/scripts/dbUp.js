var knex = require('./index');

var stocks = require('../schema/stockSchema');
var stockprices = require('../schema/stockPriceSchema');
var stockpricesArchive = require('../schema/stockPriceArchiveSchema');

Promise.all([
    stocks(knex),
    stockprices(knex),
    stockpricesArchive(knex)
  ])
  .then(function () {
    console.log('Tables Online');
    knex.destroy();
  })
  .catch(function (err) {
    console.log(err);
    knex.destroy();
  });
