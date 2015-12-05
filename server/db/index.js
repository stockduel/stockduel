var ENV = 'development';
var DATABASE = 'stockduel';

// ============= Require Schema-builders ============= \\
var users = require('../schema/authSchema.js');
var matches = require('../schema/matchesSchema.js');
var trades = require('../schema/tradesSchema.js');
var stocks = require('../schema/stocksSchema.js');
var stock_prices = require('../schema/stockpricesSchema.js');
var archive = require('../schema/archiveSchema.js');

// ============= Instatiate database connection ============= \\
var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);



// ============= Build tables ============= \\
  (function(knexInstance) {

    var builders = [users, matches, trades, stocks, stock_prices, archive];

    builders.forEach(function(builder) {
      builder(knexInstance);
    });

  }(knex))


module.exports = knex;
