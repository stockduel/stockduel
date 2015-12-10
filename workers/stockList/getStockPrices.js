#!/usr/local/bin/node

var Promise = require('bluebird');
var request = require('request');
var knex = require('./db/index');

knex('stocks').select('symbol')
  .then(function (stocks) {
    console.log(new Date(), 'retrieving stock data');
    return getStockData(stocks);
  })
  .then(function (prices) {
    console.log(new Date(), 'persisting stock data');
    var stockData = parseStockData(prices);
    return Promise.map(stockData, function (stock) {
      stock.timestamp = new Date();
      return Promise.all([
        knex('stock_prices')
        .where('symbol', stock.symbol)
        .update(stock),
        knex('stock_prices_archive').insert(stock)
      ]);
    });
  })
  .then(function () {
    console.log(new Date(), 'finished updating');
    knex.destroy();
  })
  .catch(function (err) {
    console.log('ERROR: ', err);
    knex.destroy();
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
        percent_change: stock.PercentChange
      };
    });
}
