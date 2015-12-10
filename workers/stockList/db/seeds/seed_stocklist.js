var fs = require('fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var INPUT = __dirname + '/../../init/output/stocklistPrices.json';

// Deletes ALL existing entries and then fills
exports.seed = function (knex, Promise) {

  return Promise.all([
    knex('stock_prices').del(),

    readFile(INPUT).then(function (jsonString) {
      return Promise.map(JSON.parse(jsonString), function (stock) {
        return knex('stock_prices').insert(stock);
      });
    })
  ]);
};
