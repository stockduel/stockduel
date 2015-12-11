var ENV = 'development';
var DATABASE = 'stockduel';

// ============= Require Schema-builders ============= \\

//--------\ section removed now run 'npm run dbup' \----------//

// ============= Instatiate database connection ============= \\
var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);

  var methods = {};
  
  //define the different controller files and make them available to the methods object
  methods.users = require('./dbcontrollers/users.js')(knex);
  methods.stocks = require('./dbcontrollers/stocksController.js')(knex);
  methods.matches = require('./dbcontrollers/matches.js')(knex);
  methods.trades = require('./dbcontrollers/trades.js')(knex);


module.exports = {methods: methods, knex: knex};

