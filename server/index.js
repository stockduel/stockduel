//express server here

var express = require('express');
var app = express();
var knex = require('./db/index.js');
var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
  res.send('Hello Huggada!');
  //send request to amazon url s3 thing and pipe the response
  //reqiest.get('https://s3-us-west-1.amazonaws.com/stockduel/client/v0.1.0/index.html')
  //.pipe(res);
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});