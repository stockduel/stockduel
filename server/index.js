//this index is the express server for our app
var express = require('express');
var knex = require('./db/index.js');
var router = require('./routes/index');

//morgan logs the requests to the server and body parser
//populate the req.body property with the parsed body
var morgan = require('morgan');
var bodyParser = require('body-parser');

//define a port
var port = process.env.PORT || 8080;

var pathToClient = __dirname + '/../client';
var pathToDocumentation = __dirname + '/../docs';

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

//connection to the routes in ./routes folder
app.use(router(knex));

//serving the static files
app.use('/', express.static(pathToClient));
app.use('/documentation', express.static(pathToDocumentation));

app.listen(port);
console.log("Express server listening on port", port);

//export app for testing routes
module.exports = app;
