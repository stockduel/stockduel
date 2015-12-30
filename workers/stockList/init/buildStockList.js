var fs = require('fs');
var csvParse = require('csv-parse');
var Promise = require('bluebird');


var parser = Promise.promisify(csvParse);
//read file: (from: https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback)
//Asynchronously reads the entire contents of a file
//If no encoding is specified, then the raw buffer is returned.
//f options is a string, then it specifies the encoding. Example:
//fs.readFile('/etc/passwd', 'utf8', callback);
var readFile = Promise.promisify(fs.readFile);
//Write file: (from: https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback)
//Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
//The encoding option is ignored if data is a buffer. It defaults to 'utf8'.
//If options is a string, then it specifies the encoding. Example:
//fs.writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
var writeFile = Promise.promisify(fs.writeFile);

var INPUT = __dirname + '/data/stock_list.csv';
var OUTPUT = __dirname + '/output/stocklist.json';

function stocksToObjects(stocks) {
  return stocks.map(function (stock) {
    return {
      symbol: stock[0],
      name: stock[1],
      sector: stock[5],
      industry: stock[6],
      exchange: stock[8],
    };
  });
}

//Function to take the csv file and convert it to a more useful format
//----------------------------------------------------------------------
readFile(INPUT)
  .then(function (csvBuffer) {
    //Promisify returned data
    return parser(csvBuffer);
  })
  .then(function (stocks) {
    //make the data into objects
    return stocksToObjects(stocks);
  })
  .then(function (stocks) {
    //Stringify and write to OUTPUT file
    stocks = JSON.stringify(stocks, null, 4);
    writeFile(OUTPUT, stocks);
  })
  .catch(function (err) {
    console.log(err);
  });
