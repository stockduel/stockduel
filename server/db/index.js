var ENV = 'development';
var DATABASE = 'stockduel';

var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);


// ============= Build tables ============= \\
  (function(knexInstance) {

    var builders = [users, matches, stocks, trades, stock_prices, stockprices_archive];

    builders.forEach(function(builder) {
      builder(knexInstance);
    });

  }(knex));


  var methods = {};
  
  //define the different controller files and make them available to the methods object
  // methods.auth = require('./auth.js')(knex);
  // methods.stocks = require('./stocks.js')(knex);
  methods.matches = require('./matches.js')(knex);

module.exports = knex;
