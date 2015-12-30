var knex = require('knex');
var config = require('./knexfile.js');

var ENV = process.env.ENVIRONMENT || 'development';
var db = config[ENV];

module.exports = db;
