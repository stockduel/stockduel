var express = require('express');
var knex = require('./db/index.js');
var router = require('./routes/index');

var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

var pathToClient = __dirname + '/../client';
var pathToDocumentation = __dirname + '/../docs';

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(router(knex));

app.use('/', express.static(pathToClient));
app.use('/documentation', express.static(pathToDocumentation));

app.listen(port);
console.log("Express server listening on port", port);

//export app for testing routes
module.exports = app;
