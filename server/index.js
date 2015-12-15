var express = require('express');
var app = express();
var knex = require('./db/index.js');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var bodyParser = require('body-parser');


app.use(morgan('dev'));

app.use(bodyParser.json());

var router = require('./routes/index')(knex);
app.use(router);

//serving the main file currently!
app.use('/', express.static(__dirname + '/../client'));

app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});


module.exports = app;
