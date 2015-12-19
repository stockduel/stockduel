var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var Promise = require('bluebird');
var knex = require('knex');

var app = require('../../index');
var config = require('../../db/knexfile');

// ============= Test Data ============= \\
describe('stocksRoute', function () {

  var stocks = [{
    "symbol": "TEST",
    "name": "Test, Inc.",
    "sector": "Technology",
    "industry": "Computer Software: Programming, Data Processing",
    "exchange": "NASDAQ"
  }, {
    "symbol": "FAKE",
    "name": "Test Inc.",
    "sector": "Technology",
    "industry": "Computer Software: Programming, Data Processing",
    "exchange": "NASDAQ"
  }, {
    "symbol": "XYZ",
    "name": "XYZ.com, Inc.",
    "sector": "Consumer Services",
    "industry": "Catalog/Specialty Distribution",
    "exchange": "NASDAQ"
  }, {
    "symbol": "XYZZ",
    "name": "1-800 XYZZ.COM, Inc.",
    "sector": "Consumer Services",
    "industry": "Other Specialty Stores",
    "exchange": "NASDAQ"
  }, ];

  var prices = [{
    "symbol": "TEST",
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
    "percent_change": "-1.33%",
    "timestamp": "TESTING"
  }, {
    "symbol": "FAKE",
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
    "percent_change": "-1.10%",
    "timestamp": "TESTING"
  }, {
    "symbol": "XYZ",
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
    "percent_change": "-1.29%",
    "timestamp": "TESTING"
  }, {
    "symbol": "XYZZ",
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
    "percent_change": "+5.07%",
    "timestamp": "TESTING"
  }];

  var stockArray = [{
    'stockSymbol': 'GOOG',
    'price': '2.5',
    'shares': '3'
  }, {
    'stockSymbol': 'PIH',
    'price': '25',
    'shares': '1'
  }, {
    'stockSymbol': 'FCCY',
    'price': '5',
    'shares': '7'
  }];

  // ============= Setup ============= \\
  before(function (done) {
    //init db
    knex = knex(config['development']);
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

  describe('/?search=', function () {
    describe('GET', function () {
      var search = 'TEST';
      var searchCase = 'tEsT';

      it('responds with a 200 (OK)', function (done) {
        request(app)
          .get('/stocks/?search=' + search)
          .expect(200, done);
      });

      it('responds with stocks matching the query', function (done) {
        request(app)
          .get('/stocks/?search=' + search)
          .expect(function (response) {
            var stocks = response.body;
            expect(stocks).to.be.a('object');
            expect(stocks.data.length).to.equal(2);
          })
          .expect(200, done);
      });

      it('should be case insensitive', function (done) {
        request(app)
          .get('/stocks/?search=' + searchCase)
          .expect(function (response) {
            var stocks = response.body;
            expect(stocks).to.be.a('object');
            expect(stocks.data.length).to.equal(2);
          })
          .expect(200, done);
      });
    });
  });

  describe('/update', function () {
    describe('POST', function () {

      it('responds with a 200 (OK)', function (done) {
        request(app)
          .post('/stocks/update')
          .send(stockArray)
          .expect(200, done);
      });

      it('responds with a 200 (OK)', function (done) {
        request(app)
          .post('/stocks/update')
          .send(stockArray)
          .expect(function (response) {
            var update = response.body;
            expect(update.data.length).to.equal(3);
            expect(update.data[0].price).to.not.equal(2.5);
          })
          .expect(200, done);
      });

    });
  });

  describe('/:symbol', function () {
    describe('GET', function () {
      var validSymbol = stocks[0].symbol;
      var validSymbolCase = 'tEsT';
      var invalidSymbol = 'FKSYMBL';

      it('responds with a 200 (OK) for valid symbols', function (done) {
        request(app)
          .get('/stocks/' + validSymbol)
          .expect(200, done);
      });

      it('responds with a 404 (NOT FOUND) for invalid symbols', function (done) {
        request(app)
          .get('/stocks/' + invalidSymbol)
          .expect(404, done);
      });

      it('responds with the requested stock', function (done) {
        request(app)
          .get('/stocks/' + validSymbol)
          .expect(function (res) {
            var stock = res.body.data;
            for (var prop in stocks[0]) {
              expect(stock[prop]).to.equal(stocks[0][prop]);
            }
          })
          .expect(200, done);
      });

      it('should be case insensitive', function (done) {
        request(app)
          .get('/stocks/' + validSymbolCase)
          .expect(function (res) {
            var stock = res.body.data;
            for (var prop in stocks[0]) {
              expect(stock[prop]).to.equal(stocks[0][prop]);
            }
          })
          .expect(200, done);
      });
    });
  });
});
