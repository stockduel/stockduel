var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var tradesController = require('../dbcontrollers/tradesController')(knex);
var matchesController = require('../dbcontrollers/matchesController')(knex);

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

var matches = [{
  startFunds: 100000,
  type: 'TEST'
}];

var stock = {
  name: 'Facebook, Inc.',
  symbol: 'FB',
  industry: 'Computer Software: Programming, Data Processing',
  sector: 'Technology',
  exchange: 'NASDAQ'
};


describe('Trade Controller', function () {
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
        return matchesController.createMatch(user.u_id, match.startFunds, match.type);
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
      })
      .catch(function (err) {
        console.log(err);
      });

  });

  describe('current stocks', function () {
    it('should return the stocks on hand for a given list of trades', function () {
      var trades = [{
        action: 'buy',
        symbol: 'FB',
        shares: 34,
        available_cash: 1000
      }, {
        action: 'sell',
        symbol: 'FB',
        shares: 22,
        available_cash: 47000
      }, {
        action: 'buy',
        symbol: 'TSLA',
        shares: 100,
        available_cash: 55000
      }, {
        action: 'buy',
        symbol: 'TSLA',
        shares: 34,
        available_cash: 10000
      }, {
        action: 'buy',
        symbol: 'MSFT',
        shares: 30,
        available_cash: 10000
      }, {
        action: 'sell',
        symbol: 'MSFT',
        shares: 30,
        available_cash: 10000
      }];

      var portfolio = tradesController.currentStocks(trades);
      expect(portfolio).to.be.an('object');
      expect(portfolio['MSFT']).to.equal(undefined);
      expect(portfolio['FB']).to.equal(12);
      expect(portfolio['TSLA']).to.equal(134);
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
    it('should be able to get a user portfolio', function (done) {
      var user = users[0];
      var match = matches[0];

      tradesController.getPortfolio(user.u_id, match.m_id)
        .then(function (portfolio) {
          // console.log(portfolio);
          expect(portfolio).to.be.an('object');
          expect(portfolio.portfolio.stocks.length).to.equal(1);
          expect(portfolio.portfolio.available_cash).to.be.a('number');
          done();
        });
    });
  });

});
