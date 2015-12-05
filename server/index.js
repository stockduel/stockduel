//express server here

var express = require('express');
var app = express();
var knex = require('./db/index.js');
app.get('/', function (req, res) {
  res.sendFile(__dirname + '../client/index.html');
  //send request to amazon url s3 thing and pipe the response
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});