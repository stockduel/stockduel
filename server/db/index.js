var ENV = 'development';
var DATABASE = 'stockduel';

// ============= Require Schema-builders ============= \\

//--------\ section removed now run 'npm run dbup' \----------//

// var users = require('./schema/usersSchema.js');
// var matches = require('./schema/matchesSchema.js');
// var stocks = require('./schema/stocksSchema.js');
// var trades = require('./schema/tradesSchema.js');
// var stock_prices = require('./schema/stockpricesSchema.js');
// var stockprices_archive = require('./schema/stockprices_archiveSchema.js');

// ============= Instatiate database connection ============= \\
var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);


// ============= Build tables no longer needed ============= \\
// (function(knexInstance) {

//     var builders = [users, matches, stocks, trades, stockprices_archive];

//     builders.forEach(function(builder) {
//       builder(knexInstance);
//     });

// }(knex));


  var methods = {};
  
  //define the different controller files and make them available to the methods object
  methods.users = require('./dbcontrollers/users.js')(knex);
  methods.stocks = require('./dbcontrollers/stocks.js')(knex);
  methods.matches = require('./dbcontrollers/matches.js')(knex);
  methods.trades = require('./dbcontrollers/trades.js')(knex);


module.exports = {methods: methods, knex: knex};

