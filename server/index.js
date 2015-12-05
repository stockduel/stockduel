//express server here

var express = require('express');
var app = express();
var knex = require('./db/index.js');
var port = process.env.PORT || 8080;
var http = require('http').Server(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '../client/index.html');
  //send request to amazon url s3 thing and pipe the response
  //reqiest.get('https://s3-us-west-1.amazonaws.com/stockduel/client/v0.1.0/index.html')
  //.pipe(res);
});


// var server = app.listen(port, function () {
//   var host = server.().address;
//   var port = server.address().port;
//   console.log('Example app listening at http://%s:%s', host, port);
// });

http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});