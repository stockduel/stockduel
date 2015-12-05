var ENV = 'development';

var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);

// ============= Require Schema-builders ============= \\
var users = require('./schema/authSchema.js');
var matches = require('./schema/matchesSchema.js');
var trades = require('./schema/tradesSchema.js');
var stocks = require('./schema/stocksSchema.js');
var stock_prices = require('./schema/stockpricesSchema.js');


// ============= Build tables ============= \\
(function(knexInstance) {

  var builders = [matches, stocks, stock_prices, users, trades];

  builders.forEach(function(builder) {
    builder(knexInstance);
  });

}(knex))

module.exports = knex;
