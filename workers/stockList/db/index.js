var config = require('./knexfile.js');
var env = 'development';
var knex = require('knex')(config);

module.exports = knex;
