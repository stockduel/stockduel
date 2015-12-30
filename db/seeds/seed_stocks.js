//Take the stocks seed data and insert it into the stocks table
//--------------------------------------------------------------------------
var fs = require('fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var INPUT = __dirname + '/../seed_files/stocklist.json';

// Deletes ALL existing entries and then fills
exports.seed = function (knex, Promise) {

  return Promise.all([
    knex('stocks').del(),

    readFile(INPUT).then(function (jsonString) {
      return Promise.map(JSON.parse(jsonString), function (stock) {
        return knex('stocks').insert(stock);
      });
    })
  ]);
};
