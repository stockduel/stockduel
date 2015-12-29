var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var request = require('supertest');

var knex = require('../../db/index');
var app = require('../../index');
var tradesController = require('../../db/dbcontrollers/tradesController')(knex);
var matchesController = require('../../db/dbcontrollers/matchesController')(knex);
var usersController = require('../../db/dbcontrollers/usersController')(knex);

describe('/matches', function () {

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
  }, {
    username: 'tateUser',
    password: 'tatePassword',
    name: 'tate',
    email: 'tate@tater'
  }];

  var today = Date.now();
  var threeDaysLater = today + (3 * 24 * 60 * 60 * 1000);

  var matches = [{
    startFunds: 100000,
    type: 'solo',
    startdate: new Date(today),
    enddate: new Date(threeDaysLater)
  }, {
    startFunds: 500000,
    type: 'solo',
    startdate: new Date(today),
    enddate: new Date(threeDaysLater)
  }, {
    startFunds: 250000,
    type: 'head',
    startdate: new Date(today),
    enddate: new Date(threeDaysLater)
  }];

  before(function (done) {
    //insert users into DB
    knex('users').insert(users, '*')
      .then(function (response) {
        users = response;
        done();
      });
  });


  // ============= Remove table data ============= \\

  after(function (done) {
    //remove trades
    Promise.map(users, function (user) {
        return knex('trades').where('user_id', user.u_id).del();
      })
      //remove matches
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('matches').where('creator_id', user.u_id).del();
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


  describe('/', function () {

    describe('GET', function () {

      before(function (done) {
        var user = users[0];
        var match = matches[2];
        matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startdate, match.enddate)
          .then(function () {
            done();
          });
      });

      it('returns all joinable matches', function (done) {
        request(app)
          .get('/matches/')
          .expect(function (response) {
            var matches = response.body.data;
            expect(matches).to.be.an('array');
            expect(matches.length).to.equal(1);
          })
          .expect(200, done);
      });

    });

    describe('POST', function () {

      before(function () {
        match = matches[0];
        match.userId = users[0].u_id;
      });

      it('responds with a 200 (OK)', function (done) {

        request(app)
          .post('/matches/')
          .send(match)
          .expect(200, done);
      });

      it('responds with the created match', function (done) {

        request(app)
          .post('/matches/')
          .send(matches[0])
          .expect(function (response) {
            var match = response.body;
            expect(match).to.be.a('object');
            expect(match.data.creator_id).to.be.a('number');
          })
          .expect(200, done);
      });
    });
  });

  describe('/:matchId', function () {

    var testMatch;

    before(function (done) {
      var user = users[0];
      var match = matches[2];
      matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startdate, match.enddate)
        .then(function (createdMatch) {
          testMatch = createdMatch;
          done();
        });
    });

    describe('GET', function () {

      it('responds with a 200 (OK)', function (done) {
        var matchId = testMatch.m_id;

        request(app)
          .get('/matches/' + matchId)
          .expect(200, done);
      });

      it('responds with the match', function (done) {
        var matchId = testMatch.m_id;

        request(app)
          .get('/matches/' + matchId)
          .expect(function (response) {
            var match = response.body;
            expect(match).to.be.a('object');
            expect(match.data.creator_id).to.be.a('number');
            expect(match.data.m_id).to.equal(matchId);
          })
          .expect(200, done);
      });

    });

    xdescribe('PUT', function () {

      it('joins and returns the match', function (done) {
        var matchId = testMatch.m_id;
        var userId = users[2].u_id;

        request(app)
          .put('/matches/' + matchId)
          .send({
            userId: userId
          })
          .expect(function (response) {
            var match = response.body;
            expect(match).to.be.a('object');
            expect(match.data.m_id).to.equal(matchId);
            expect(match.data.challengee).to.equal(userId);
          })
          .expect(200, done);
      });

    });

  });


  describe('/user/:userId', function () {

    describe('GET', function () {

      it('responds with a 200 (OK)', function (done) {
        var userId = users[0].u_id;

        request(app)
          .get('/matches/user/' + userId)
          .expect(200, done);
      });

      it('responds all matches for a user', function (done) {

        var userId = users[0].u_id;

        request(app)
          .get('/matches/user/' + userId)
          .expect(function (response) {
            var userMatches = response.body;
            expect(userMatches.data).to.be.a('array');
          })
          .expect(200, done);
      });
    });
  });
});
