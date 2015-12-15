var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var Promise = require('bluebird');
var knex = require('knex');
var config = require('../../db/knexfile');
var app = require('../../index');

 describe('/trades/:matchid/:userid', function () {

  // ============= Test Data ============= \\

  var userObj = {
    username: 'annaUser',
    password: 'annaPassword',
    name: 'anna',
    email: 'anna@annars'
  };

  var trades = [{ user_id: 1, match_id: 1, symbol: 'GOOG', shares: 5, action: 'buy' },
  { user_id: 1, match_id: 1, symbol: 'GOOG', shares: 5, action: 'sell' }];

  var match = {
    starting_funds: 100000,
    startdate: 'Sat Dec 12 2015 16:55:38 GMT-0800 (PST)',
    enddate: 'Fri Jan 29 2016 00:00:00 GMT-0800 (PST)',
    status: 'in progress',
    type: 'TEST'
  };

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
    knex = knex(config['development']);

    return knex('users').insert(userObj, '*')
    .then(function (userInserted) {
      userObj = userInserted[0];
      match.creator_id = userObj.u_id;
      match.challengee = userObj.u_id;
      return knex('matches').insert(match, '*');
    })
    .then(function (response) {
      match = response[0];
      done();
    });

  });

  // ============= Teardown ============= \\

  after(function (done) {
    //remove trades
    return Promise.map(trades, function (trade) {
      return knex('trades').where('action', trade.action).del();
    })
    .then(function (arrayOfTradeDeletionResults) {
      return knex('matches').where('type', 'TEST').del();
    })
    .then(function(arrayOfMatchDeletionResults) {
      return knex('users').where('email', 'anna@annars').del();
    })
    .then(function () {
      console.log('matches after hook');
      done();
    });

  });

  // ============= Tests ============= \\

    describe('POST /trades/:matchid/:userid', function () {

      it('buy responds with a 200 (OK)', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'buy', stockTicker: 'GOOG' })
          .expect(200, done);
      });

      it('responds with the buy trade', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'buy', stockTicker: 'GOOG' })
          .expect(function (response) {
            var buy = response.body;
            expect(buy).to.be.a('object');
            expect(buy.data.price).to.be.a('number');
          })
          .expect(200, done);
      });

      it('sell responds with a 200 (OK)', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'sell', stockTicker: 'GOOG' })
          .expect(200, done);
      });

      it('responds with the sell trade', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'sell', stockTicker: 'GOOG' })
          .expect(function (response) {
            var sell = response.body;
            expect(sell).to.be.a('object');
            expect(sell.data.price).to.be.a('number');
          })
          .expect(200, done);

      });

    });

    describe('GET /trades/:matchid/:userid', function () {

      it('should get portfolio responds with a 200 (OK)', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .get('/trades/' + matchid + '/' + userid)
          .expect(200, done);

      });

      it('should respond with the portfolio of the specific user for a specific match', function (done) {
        var matchid = match.m_id;
        var userid = userObj.u_id;

        request(app)
          .get('/trades/' + matchid + '/' + userid)
          .expect(function (response) {
            var portfolio = response.body;
            expect(portfolio).to.be.a('object');
            expect(portfolio.data[0].price).to.be.a('number');
            //would like to check the user id here but couldn find a way to ask if the creator_id or the challengee had the userid?
          })
          .expect(200, done);

      });
    });

});