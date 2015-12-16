var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var tradesController = require('../dbcontrollers/tradesController')(knex);
var matchesController = require('../dbcontrollers/matchesController')(knex);
var usersController = require('../dbcontrollers/usersController')(knex);


describe('getInitialState Controller', function () {

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
  }, {
    startFunds: 100000,
    type: 'TEST2'
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
        return Promise.map(matches, function (match) {
          return matchesController.createMatch(user.u_id, match.startFunds, match.type);
        });
      })
      .then(function (createdMatches) {
        matches = createdMatches;
        done();
      });

  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove trades
    knex('trades')
      .where({
        'match_id': matches[0].m_id
      })
      .orWhere({
        'match_id': matches[1].m_id
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

  describe('buy', function () {
    it('should be able to place a buy order', function (done) {
      var user = users[0];
      var match = matches[0];

      console.log(match.m_id);

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

      console.log(match.m_id);

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

  });

  describe('buy', function () {
    it('should be able to place a buy order', function (done) {
      var user = users[0];
      var match = matches[1];

      console.log(match.m_id);
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


  describe('getInitialState', function () {
    it('should be able to get all the things', function (done) {
      var user = users[0];

      matchesController.getAllMatches(user.u_id)
        .then(function (matches) {
          expect(matches).to.be.an('array');
          expect(matches.length).to.equal(2);
          expect(matches[0].available_cash).to.be.a('number');
          done();
        });
    });

  });

});
