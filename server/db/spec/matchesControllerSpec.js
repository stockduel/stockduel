var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var matchesController = require('../dbcontrollers/matchesController')(knex);

var users = [{
  username: 'annaUser',
  password: 'annaPassword',
  name: 'anna',
  email: 'anna@annar'
}, {
  username: 'kateUser',
  password: 'katePassword',
  name: 'kate',
  email: 'kate@kater'
}];

var matches = [{
  startFunds: 100000,
  type: 'TEST'
}];



describe('Match Controller', function () {

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
        return knex('matches').where('type', 'TEST').del();
      })
      //remove users
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('users').where('u_id', user.u_id).del();
        });
      })
      .then(function () {
        // console.log('matches after hook');
        done();
      });

  });

  it('should insert a match into the matches table', function (done) {
    var user = users[0];
    var match = matches[0];

    matchesController.createMatch(user.u_id, match.startFunds, match.type)
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

    matchesController.createMatch(user.u_id, match.startFunds, match.type)
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

  it('should get the matches for a user', function (done) {
    var userID = 1;

    matchesController.getUsersMatches(userID)
      .then(function (matches) {
        expect(matches).to.be.a('array');
        done();
      });
  });

});
