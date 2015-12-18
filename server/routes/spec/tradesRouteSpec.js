var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var request = require('supertest');

var knex = require('../../db/index');
var app = require('../../index');
var tradesController = require('../../db/dbcontrollers/tradesController')(knex);
var matchesController = require('../../db/dbcontrollers/matchesController')(knex);
var usersController = require('../../db/dbcontrollers/usersController')(knex);


describe('/trades', function () {

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
    startFunds: 500000,
    type: 'solo',
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
          return matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startDate, match.endDate);
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
      });
  });

  // ============= Tests ============= \\

  describe('/:matchid/:userid', function () {

    describe('POST', function () {

      describe('buy', function () {

        it('buy responds with a 200 (OK)', function (done) {
          var matchid = matches[0].m_id;
          var userid = users[0].u_id;
          var trade = {
            stockTicker: 'GOOG',
            numShares: 5,
            action: 'buy'
          };

          request(app)
            .post('/trades/' + matchid + '/' + userid)
            .send(trade)
            .expect(200, done);
        });

        it('responds with the buy trade', function (done) {
          var matchid = matches[0].m_id;
          var userid = users[0].u_id;
          var trade = {
            stockTicker: 'GOOG',
            numShares: 5,
            action: 'buy'
          };

          request(app)
            .post('/trades/' + matchid + '/' + userid)
            .send(trade)
            .expect(function (response) {
              var buy = response.body;
              expect(buy).to.be.a('object');
              expect(buy.data.price).to.be.a('number');
            })
            .expect(200, done);
        });

      });

      describe('sell', function () {

        it('sell responds with a 200 (OK)', function (done) {
          var matchid = matches[0].m_id;
          var userid = users[0].u_id;
          var trade = {
            stockTicker: 'GOOG',
            numShares: 5,
            action: 'sell'
          };

          request(app)
            .post('/trades/' + matchid + '/' + userid)
            .send(trade)
            .expect(200, done);
        });

        it('responds with the sell trade', function (done) {
          var matchid = matches[0].m_id;
          var userid = users[0].u_id;
          var trade = {
            stockTicker: 'GOOG',
            numShares: 5,
            action: 'sell'
          };

          request(app)
            .post('/trades/' + matchid + '/' + userid)
            .send(trade)
            .expect(function (response) {
              var sell = response.body;
              expect(sell).to.be.a('object');
              expect(sell.data.price).to.be.a('number');
            })
            .expect(200, done);
        });
      });
    });

    describe('GET', function () {
      it('should get portfolio responds with a 200 (OK)', function (done) {
        var matchid = matches[0].m_id;
        var userid = users[0].u_id;

        request(app)
          .get('/trades/' + matchid + '/' + userid)
          .expect(200, done);

      });

      it('should respond with the portfolio of the specific user for a specific match', function (done) {
        var matchid = matches[0].m_id;
        var userid = users[0].u_id;

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

});
