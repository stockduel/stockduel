#!/usr/local/bin/node

var fs = require('fs');
var Promise = require('bluebird');
var request = require('request');

var api = 'https://query.yahooapis.com/v1/public/yql';
var queryLeft = '?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in("';
var queryRight = '")&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=';


var INPUT = __dirname + '/output/stocklist.json';
var OUTPUT = __dirname + '/output/stocklistPrices.json';

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

readFile(INPUT)
  .then(function (json) {
    return JSON.parse(json);
  })
  .then(function (stocks) {
    console.log(new Date(), 'retrieving');
    return getStockData(stocks);
  })
  .then(function (prices) {
    console.log(new Date(), 'parse start');
    var stockData = parseStockData(prices);
    stockData = JSON.stringify(stockData, null, 4);
    return writeFile(OUTPUT, stockData);
  })
  .catch(function (err) {
    console.log('ERROR: ', err);
  });

function queryAPI(stocks) {
  var api = 'https://query.yahooapis.com/v1/public/yql';

  return new Promise(function (resolve, reject) {

    var symbolQuery = stocks.map(function (stock) {
      return stock.symbol;
    }).join(',%20');

    var query = api +
      '?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in("' +
      symbolQuery +
      '")&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=';

    request(query, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body).query.results.quote);
      } else {
        reject(error);
      }
    });

  });
}

function getStockData(stocks) {
  var LIMIT = 100;
  var stockData = [];
  for (var i = 0; i < stocks.length; i += LIMIT) {
    batch = stocks.slice(i, i + LIMIT);
    stockData.push(queryAPI(batch));
  }
  return Promise.all(stockData);
}

function parseStockData(prices) {
  return [].concat.apply([], prices)
    .map(function (stock) {
      return {
        symbol: stock.symbol,
        bid: stock.Bid,
        ask: stock.Ask,
        change: stock.Change,
        days_low: stock.DaysLow,
        days_high: stock.DaysHigh,
        year_low: stock.YearLow,
        year_high: stock.YearHigh,
        earnings_share: stock.EarningsShare,
        eps_estimate_current_year: stock.EPSEstimateCurrentYear,
        eps_estimate_next_year: stock.EPSEstimateNextYear,
        market_capitalization: stock.MarketCapitalization,
        ebitda: stock.EBITDA,
        days_range: stock.DaysRange,
        open: stock.open,
        previous_close: stock.PreviousClose,
        pe_ratio: stock.PERatio,
        peg_ratio: stock.PEGRatio,
        volume: stock.PEGRatio,
        percent_change: stock.PercentChange,
        timestamp: new Date()
      };
    });
}
