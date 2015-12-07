var ENV = 'development';
var DATABASE = 'stockduel';

// ============= Require Schema-builders ============= \\
var users = require('./schema/usersSchema.js');
var matches = require('./schema/matchesSchema.js');
var stocks = require('./schema/stocksSchema.js');
var trades = require('./schema/tradesSchema.js');
var stock_prices = require('./schema/stockpricesSchema.js');
var stockprices_archive = require('./schema/stockprices_archiveSchema.js');

// ============= Instatiate database connection ============= \\
var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);



// ============= Build tables ============= \\
  (function(knexInstance) {

    var builders = [users, matches, stocks, trades, stock_prices, stockprices_archive];

    builders.forEach(function(builder) {
      builder(knexInstance);
    });

  }(knex));


module.exports = knex;


