var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var tradesController = require('../dbcontrollers/tradesController')(knex);
var matchesController = require('../dbcontrollers/matchesController')(knex);

describe('Trade Controller', function () {
  var users = [{
    username: 'annaUser',
    password: 'annaPassword',
    name: 'anna',
    email: 'anna@annars'
  }, {
    username: 'kateUser',
    password: 'katePassword',
    name: 'kate',
    email: 'kate@katers'
  }];

  var today = Date.now();
  var threeDaysLater = today + (3 * 24 * 60 * 60 * 1000);

  var matches = [{
    startFunds: 100000,
    type: 'solo',
    startDate: new Date(today),
    endDate: new Date(threeDaysLater)
  }, {
    startFunds: 300000,
    type: 'head',
    startDate: new Date(today),
    endDate: new Date(threeDaysLater)
  }];

  var stock = {
    name: 'Facebook, Inc.',
    symbol: 'FB',
    industry: 'Computer Software: Programming, Data Processing',
    sector: 'Technology',
    exchange: 'NASDAQ'
  };

  // ============= Setup ============= \\
  before(function (done) {
    //insert users into DB
    knex('users').insert(users, '*')
      .then(function (response) {
        users = response;
      })
      //create a match
      .then(function () {
        var user = users[0];
        var match = matches[0];
        return matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startDate, match.endDate);
      })
      .then(function (createdMatch) {
        matches[0].m_id = createdMatch.m_id;
        done();
      });

  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove trades
    knex('trades').where({
        'match_id': matches[0].m_id
      }).del()
      //remove matches
      .then(function () {
        return Promise.map(matches, function (match) {
          return knex('matches').where('m_id', match.m_id).del();
        });
      })
      //remove users
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('users').where('u_id', user.u_id).del();
        });
      })
      .then(function () {
        done();
      });

  });

  describe('reduceTradesToPortfolio', function () {
    it('should return the stocks on hand for a given list of trades', function () {
      var startingCash = 250000;

      var trades = [{
        action: 'buy',
        symbol: 'FB',
        shares: 34,
        price: 100
      }, {
        action: 'sell',
        symbol: 'FB',
        shares: 22,
        price: 50
      }, {
        action: 'buy',
        symbol: 'TSLA',
        shares: 100,
        price: 100
      }, {
        action: 'buy',
        symbol: 'TSLA',
        shares: 34,
        price: 130
      }, {
        action: 'buy',
        symbol: 'MSFT',
        shares: 30,
        price: 100
      }, {
        action: 'sell',
        symbol: 'MSFT',
        shares: 30,
        price: 110
      }];

      var portfolio = tradesController.reduceTradesToPortfolio(trades, startingCash);
      var stocks = portfolio.stocks;

      expect(portfolio).to.be.an('object');
      expect(portfolio.available_cash).to.equal(233580);
      expect(stocks['MSFT']).to.equal(undefined);
      expect(stocks['FB'].shares).to.equal(12);
      expect(stocks['TSLA'].shares).to.equal(134);
      expect(stocks['TSLA'].price).to.equal(107.61);
    });
  });

  describe('buy', function () {
    it('should be able to place a buy order', function (done) {
      var user = users[0];
      var match = matches[0];
      var trade = {
        shares: 100,
        symbol: stock.symbol
      };

      tradesController.buy(user.u_id, match.m_id, trade.shares, trade.symbol)
        .then(function (trade) {
          expect(trade.shares).to.equal(100);
          done();
        });
    });
  });

  describe('sell', function (done) {
    it('should be able to place a sell trade', function (done) {
      var user = users[0];
      var match = matches[0];
      var trade = {
        shares: 90,
        symbol: 'FB'
      };

      tradesController.sell(user.u_id, match.m_id, trade.shares, trade.symbol)
        .then(function (trade) {
          expect(trade.shares).to.equal(90);
          expect(trade.symbol).to.equal('FB');
          expect(trade.action).to.equal('sell');
          expect(trade.price).to.be.a('number');
          done();
        });
    });

    it('should not be able to place a sell trade for unowned stock', function (done) {
      var user = users[0];
      var match = matches[0];
      var trade = {
        shares: 90,
        symbol: 'TSLA'
      };

      tradesController.sell(user.u_id, match.m_id, trade.shares, trade.symbol)
        .then(function (trade) {
          expect(trade).to.equal(null);
          return tradesController.getTrades(user.u_id, match.m_id);
        })
        .then(function (trades) {
          expect(trades.length).to.equal(2);
          done();
        });
    });

    it('should not be able to place a sell trade more stock than owned', function (done) {
      var user = users[0];
      var match = matches[0];
      var trade = {
        shares: 90,
        symbol: 'FB'
      };

      tradesController.sell(user.u_id, match.m_id, trade.shares, trade.symbol)
        .then(function (trade) {
          expect(trade).to.equal(null);
          return tradesController.getTrades(user.u_id, match.m_id);
        })
        .then(function (trades) {
          expect(trades.length).to.equal(2);
          done();
        });
    });

  });

  describe('getPortfolio', function () {

    before(function (done) {
      var user1 = users[0];
      var user2 = users[1];
      var match = matches[1];

      matchesController.createMatch(user1.u_id, match.startFunds, match.type, match.startDate, match.endDate)
        .then(function (createdMatch) {
          matches[1].m_id = createdMatch.m_id;
          return matchesController.joinMatch(createdMatch.m_id, user2.u_id);
        })
        .then(function () {
          done();
        });
    });

    after(function (done) {
      knex('trades').where({
        'match_id': matches[1].m_id
      }).del().then(function () {
        done();
      });
    });

    it('should be able to get a user portfolio', function (done) {
      var user = users[0];
      var match = matches[0];

      tradesController.getPortfolio(user.u_id, match.m_id)
        .then(function (portfolio) {
          expect(portfolio).to.be.an('object');
          expect(portfolio.stocks[0].marketValue).to.be.a('number');
          expect(portfolio.stocks[0].gain_loss).to.be.a('number');
          expect(portfolio.stocks.length).to.equal(1);
          expect(portfolio.available_cash).to.be.a('number');
          done();
        });
    });

    it('should be able to get a user portfolio that has no trades', function (done) {
      var user = users[1];
      var match = matches[0];

      tradesController.getPortfolio(user.u_id, match.m_id)
        .then(function (portfolio) {
          expect(portfolio).to.be.an('object');
          expect(portfolio.stocks).to.be.an('array');
          expect(portfolio.stocks.length).to.equal(0);
          expect(portfolio.available_cash).to.be.a('number');
          expect(portfolio.available_cash).to.equal(100000);
          done();
        });
    });

    it('should be able to get 2 different user portfolios from a head to head match', function (done) {
      var user1 = users[0];
      var user2 = users[1];
      var match = matches[1];

      var user1Trades = [{
        symbol: 'FB',
        shares: 34
      }, {
        symbol: 'GOOG',
        shares: 100
      }, {
        symbol: 'TSLA',
        shares: 34,
      }];

      var user2Trades = [{
        symbol: 'MSFT',
        shares: 30
      }];

      Promise.all([
          Promise.map(user1Trades, function (trade) {
            return tradesController.buy(user1.u_id, match.m_id, trade.shares, trade.symbol);
          }),
          Promise.map(user2Trades, function (trade) {
            return tradesController.buy(user2.u_id, match.m_id, trade.shares, trade.symbol);
          })
        ])
        .then(function () {
          return Promise.all([
            tradesController.getPortfolio(user1.u_id, match.m_id),
            tradesController.getPortfolio(user2.u_id, match.m_id)
          ]);
        })
        .then(function (portfolio) {
          var user1Portfolio = portfolio[0];
          var user2Portfolio = portfolio[1];
          expect(user1Portfolio.available_cash).to.be.below(user2Portfolio.available_cash);
          expect(user1Portfolio.stocks.length).to.be.above(user2Portfolio.stocks.length);
          done();
        });


    });
  });

});
