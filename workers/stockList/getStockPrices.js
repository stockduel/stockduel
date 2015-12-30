//Only file in this stockList folder in deployment
//------------------------------------------------
#!/usr/local/bin/node

var Promise = require('bluebird');
var request = require('request');
var knex = require('./db/index');

//Update the stock_prices table and make a new entry in the stock archive table
//-------------------------------------------------------------------------------

//Conect to the stocks database selecting all symbols(stock tickers)
knex('stocks').select('symbol')
  //take the returned symbols and via getStockData get up to 100 at a time stock symbols
  //these are then passed to queryAPI which queries a yahoo api with each stock symbol
  .then(function (stocks) {
    console.log(new Date(), 'retrieving stock data');
    return getStockData(stocks);
  })
  .then(function (prices) {
    //updated prices for the stocks returned from Yahoo api and given to parseStockData
    //which makes an array of stock price objects with the data from Yahoo filtered
    console.log(new Date(), 'persisting stock data');
    var stockData = parseStockData(prices);
    //each stockDate object is given a timeStamp and then the stock_prices 
    //table is updated and the stock is also inserted into the stock_prices_archive table
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

//knex.destry(): break the connection with knex

//Knex Docs:
//If you ever need to explicitly teardown the connection pool, 
//you may use knex.destroy([callback]). You may use knex.destroy 
//by passing a callback, or by chaining as a promise, just not both.


//Send a request to Yahoo api for data from the stock symbol given see data/api_response_example
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

//Pass on to queryAPI max of 100 at a time symbols
function getStockData(stocks) {
  var LIMIT = 100;
  var stockData = [];
  for (var i = 0; i < stocks.length; i += LIMIT) {
    batch = stocks.slice(i, i + LIMIT);
    stockData.push(queryAPI(batch));
  }
  return Promise.all(stockData);
}

//Called with a list of stock data. Return an array of objects filtering out all but the the following properties
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
