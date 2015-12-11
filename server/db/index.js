var ENV = 'development';
var DATABASE = 'stockduel';

var config = require('./knexfile.js');
var knex = require('knex')(config[ENV]);


module.exports = knex;
