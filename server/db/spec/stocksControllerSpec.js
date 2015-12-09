var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('knex');

var config = require('../knexfile');
var stocksController = require('../dbcontrollers/stocksController');


// ============= Helpers ============= \\
function camelCaseToSnake(string) {
  return string.replace(/\.?([A-Z]+)/g, function (x, y) {
    return "_" + y.toLowerCase();
  }).replace(/^_/, "");
}

function keysToLowerCase(arrayOfObjects) {
  return arrayOfObjects.map(function (obj) {
    var o = {};
    for (var key in obj) {
      o[camelCaseToSnake(key)] = obj[key];
    }
    return o;
  });
}

// ============= Test Data ============= \\
describe('stocksController', function () {

  var stocks = [{
    "symbol": "FB",
    "name": "Facebook, Inc.",
    "sector": "Technology",
    "industry": "Computer Software: Programming, Data Processing",
    "exchange": "NASDAQ"
  }, {
    "symbol": "GOOG",
    "name": "Alphabet Inc.",
    "sector": "Technology",
    "industry": "Computer Software: Programming, Data Processing",
    "exchange": "NASDAQ"
  }, {
    "symbol": "AMZN",
    "name": "Amazon.com, Inc.",
    "sector": "Consumer Services",
    "industry": "Catalog/Specialty Distribution",
    "exchange": "NASDAQ"
  }, {
    "symbol": "FLWS",
    "name": "1-800 FLOWERS.COM, Inc.",
    "sector": "Consumer Services",
    "industry": "Other Specialty Stores",
    "exchange": "NASDAQ"
  }, ];

  var prices = [{
    "symbol": "FB",
    "bid": "104.76",
    "ask": "104.78",
    "change": "-1.41",
    "days_low": "104.66",
    "days_high": "106.79",
    "year_low": "72.00",
    "year_high": "110.65",
    "earnings_share": "1.00",
    "eps_estimate_current_year": "2.17",
    "eps_estimate_next_year": "2.86",
    "market_capitalization": "296.29B",
    "ebitda": "6.66B",
    "days_range": "104.66 - 106.79",
    "previous_close": "106.18",
    "pe_ratio": "105.19",
    "peg_ratio": "1.63",
    "volume": "1.63",
    "percent_change": "-1.33%"
  }, {
    "symbol": "GOOG",
    "bid": "758.01",
    "ask": "758.66",
    "change": "-8.41",
    "days_low": "755.09",
    "days_high": "768.73",
    "year_low": "486.23",
    "year_high": "775.96",
    "earnings_share": "23.72",
    "eps_estimate_current_year": "28.99",
    "eps_estimate_next_year": "34.22",
    "market_capitalization": "521.57B",
    "ebitda": "23.30B",
    "days_range": "755.09 - 768.73",
    "previous_close": "766.81",
    "pe_ratio": "31.97",
    "peg_ratio": "1.55",
    "volume": "1.55",
    "percent_change": "-1.10%"
  }, {
    "symbol": "AMZN",
    "bid": "663.81",
    "ask": "664.19",
    "change": "-8.65",
    "days_low": "660.50",
    "days_high": "675.46",
    "year_low": "285.25",
    "year_high": "684.82",
    "earnings_share": "0.70",
    "eps_estimate_current_year": "1.88",
    "eps_estimate_next_year": "5.64",
    "market_capitalization": "311.25B",
    "ebitda": "7.01B",
    "days_range": "660.50 - 675.46",
    "previous_close": "672.64",
    "pe_ratio": "951.28",
    "peg_ratio": "5.92",
    "volume": "5.92",
    "percent_change": "-1.29%"
  }, {
    "symbol": "FLWS",
    "bid": "8.49",
    "ask": "8.50",
    "change": "+0.41",
    "days_low": "8.06",
    "days_high": "8.52",
    "year_low": "6.80",
    "year_high": "13.46",
    "earnings_share": "0.30",
    "eps_estimate_current_year": "0.42",
    "eps_estimate_next_year": "0.58",
    "market_capitalization": "550.67M",
    "ebitda": "68.49M",
    "days_range": "8.06 - 8.52",
    "previous_close": "8.08",
    "pe_ratio": "28.68",
    "peg_ratio": "1.07",
    "volume": "1.07",
    "percent_change": "+5.07%"
  }];

  // ============= Setup ============= \\
  before(function (done) {
    //init db
    knex = knex(config['development']);
    //init ctrlr
    stocksController = stocksController(knex);
    //insert test cases
    Promise.all([
      knex('stocks').insert(stocks),
      knex('stock_prices').insert(prices),
    ]).then(function () {
      done();
    });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    Promise.all([
        Promise.map(stocks, function (stock) {
          return knex('stocks').where(stock).del();
        }),
        Promise.map(prices, function (price) {
          return knex('stock_prices').where(price).del();
        })
      ])
      .then(function () {
        done();
      });
  });

  // ============= Tests ============= \\
  describe('getStock', function () {
    var symbol = stocks[0].symbol;
    var fakeSymbol = 'BOB';

    it('should retrieve the stock profile for a valid symbol', function (done) {
      stocksController.getStock(symbol)
        .then(function (response) {
          expect(response).to.be.a('object');
          for (var prop in stocks[0]) {
            expect(response[prop]).to.equal(stocks[0][prop]);
          }
          done();
        });
    });

    it('should not retrieve a stock profile for an invalid symbol', function (done) {
      stocksController.getStock(fakeSymbol)
        .then(function (response) {
          expect(response).to.equal(null);
          done();
        });
    });

  });

  describe('searchStock', function () {
    var symbolLike = 'F';
    var fakeSymbol = 'BOB';
    var nameAndSymbol = 'A';

    it('should retrieve the stock profile for a query symbol with matches', function (done) {
      stocksController.searchStock(symbolLike)
        .then(function (response) {
          expect(response).to.be.a('array');
          expect(response.length).to.equal(2);
          done();
        });
    });

    it('should not retrieve any stock profiles for a query symbol with no matches', function (done) {
      stocksController.searchStock(fakeSymbol)
        .then(function (response) {
          expect(response).to.be.a('array');
          expect(response.length).to.equal(0);
          done();
        });
    });

    it('should retrieve stock profiles for matches to symbol or name', function (done) {
      stocksController.searchStock(nameAndSymbol)
        .then(function (response) {
          expect(response).to.be.a('array');
          expect(response.length).to.equal(2);
          done();
        });
    });

  });

});
