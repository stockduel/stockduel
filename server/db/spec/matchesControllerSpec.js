var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var matchesController = require('../dbcontrollers/matchesController')(knex);


describe('Match Controller', function () {

  var users = [{
    username: 'annaUser',
    name: 'anna',
    email: 'anna@annar'
  }, {
    username: 'kateUser',
    name: 'kate',
    email: 'kate@kater'
  }, {
    username: 'tateUser',
    name: 'tate',
    email: 'tate@tater'
  }];

  var today = Date.now();
  var threeDaysLater = today + (3 * 24 * 60 * 60 * 1000);

  var matches = [{
    startFunds: 100000,
    type: 'head',
    startDate: new Date(today),
    endDate: new Date(threeDaysLater)
  }, {
    startFunds: 500000,
    type: 'solo',
    startDate: new Date(today),
    endDate: new Date(threeDaysLater)
  }, {
    startFunds: 250000,
    type: 'head',
    startDate: new Date(today),
    endDate: new Date(threeDaysLater)
  }];

  // ============= Setup ============= \\
  before(function (done) {
    //insert users into DB
    knex('users').insert(users, '*')
      .then(function (response) {
        users = response;
        done();
      });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove matches
    Promise.map(matches, function (match) {
        return knex('matches')
          .where('creator_id', users[0].u_id)
          .orWhere('creator_id', users[1].u_id)
          .del();
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

  describe('createMatch', function () {

    it('should insert a match into the matches table', function (done) {
      var user = users[0];
      var match = matches[0];

      matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startDate, match.endDate)
        .then(function (createdMatch) {
          expect(createdMatch.creator_id).to.equal(user.u_id);
          expect(createdMatch.starting_funds).to.equal(match.startFunds);
          expect(createdMatch.type).to.equal(match.type);
          done();
        });

    });

    it('should get a specific match', function (done) {
      var user = users[0];
      var match = matches[0];

      matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startDate, match.endDate)
        .then(function (createdMatch) {
          var id = createdMatch.m_id;
          matchesController.getMatch(id)
            .then(function (foundMatch) {
              expect(foundMatch.starting_funds).to.equal(match.startFunds);
              expect(foundMatch.type).to.equal(match.type);
              done();
            });
        });
    });

  });

  describe('getUsersMatches', function () {
    it('should get the matches for a user', function (done) {
      var userId = users[0].u_id;

      matchesController.getUsersMatches(userId)
        .then(function (matches) {
          expect(matches).to.be.a('array');
          done();
        });
    });
  });

  describe('getAllJoinableMatches', function () {
    it('should get all joinable matches', function (done) {
      var userId = users[1].u_id;

      matchesController.getAllJoinableMatches(userId)
        .then(function (matches) {
          expect(matches).to.be.a('array');
          expect(matches.length).to.equal(2);
          done();
        });
    });

    it('should not get it\'s own matches', function (done) {
      var userId = users[0].u_id;

      matchesController.getAllJoinableMatches(userId)
        .then(function (matches) {
          expect(matches).to.be.a('array');
          expect(matches.length).to.equal(0);
          done();
        });
    });
  });

  describe('joinMatch', function () {
    var testMatch;

    before(function (done) {
      user = users[0];
      match = matches[2];

      matchesController.createMatch(user.u_id, match.startFunds, match.type, match.startDate, match.endDate)
        .then(function (createdMatch) {
          testMatch = createdMatch;
          done();
        });
    });

    it('should join a match', function (done) {
      var user = users[1];
      matchesController.joinMatch(testMatch.m_id, user.u_id)
        .then(function (match) {
          expect(match.challengee).to.equal(user.u_id);
          done();
        });
    });

    it('should not join a filled match', function (done) {
      var user = users[2];
      matchesController.joinMatch(match.m_id, user.u_id)
        .then(function (joinedMatch) {
          expect(joinedMatch).to.equal(null);
          matchesController.getMatch(testMatch.m_id)
            .then(function (match) {
              expect(match.challengee).to.not.equal(user.u_id);
              done();
            });
        });
    });
  });


});
