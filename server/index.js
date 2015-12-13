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


app.get('/', function (req, res) {
  res.send('Hello Huggada!');
  //send request to amazon url s3 thing and pipe the response
  //reqiest.get('https://s3-us-west-1.amazonaws.com/stockduel/client/v0.1.0/index.html')
  //.pipe(res);
});

app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});


module.exports = app;
