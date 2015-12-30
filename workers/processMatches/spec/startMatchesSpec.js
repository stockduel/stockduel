var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../db/index');

var startMatches = require('../startMatches/startMatches')(knex);
var matchesController = require('./../../../server/db/dbcontrollers/matchesController')(knex);
// var tradesController = require('./../../../server/db/dbcontrollers/tradesController')(knex);


describe('startMatches Worker', function () {
  var today = new Date();
  var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14);
  var date_before_start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14);
  var end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 21.5);
  var other_end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 21.5);
  console.log('date is ', date);
  console.log('end_date is ', end_date);
  var users = [{
    username: 'EXPERIMENT',
    password: 'ExperimentPassword',
    name: 'experiment1',
    email: 'experiment1@a.com'
  }, {
    username: 'EXPERIMENT2',
    password: 'ExperimentPassword',
    name: 'experiment2',
    email: 'experiment2@a.com'
  }];
  var matches = [
  //solo match
  {
    starting_funds: 100000,
    type: 'solo',
    startdate: date,
    enddate: end_date,
  },
  //active head to head match
  {
    starting_funds: 100000,
    type: 'head',
    startdate: date,
    enddate: end_date,
  },
  //match with different start date
  {
    starting_funds: 200000,
    type: 'head',
    startdate: end_date,
    enddate: other_end_date,
  }];


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
          return matchesController.createMatch(user.u_id, match.starting_funds,
           match.type, match.startdate, match.enddate);
        });
      })
      .then(function (createdMatches) {
        var otherUser = users[1];
        return Promise.map(createdMatches, function (match) {
          if ( match.type === 'head' && match.starting_funds === 100000) {
            return knex('matches')
              .where('m_id', '=', match.m_id)
              .update({challengee: otherUser.u_id
              }, '*')
              .then(function (match) {
                return match[0];
              });
          }
          return match;
        });
      })
      .then(function (readiedMatches) {
        matches = readiedMatches;
        done();
      });
  });

  // ============= Teardown ============= \\
  after(function (done) {

   return Promise.map(matches, function (match) {
     return knex('matches').where('m_id', match.m_id).del();
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

  describe('selectPendingMatches', function () {
    it('should return all matches that are starting that day', function (done) {

      startMatches.selectPendingMatches(end_date)
        .then(function (matches) {
          startMatches.selectPendingMatches(date)
          .then(function (otherMatches) {
            expect(matches.length).to.equal(3);
            expect(otherMatches.length).to.equal(2);
            done(); 
          });
        });
    });

  });

  describe('activateMatch', function (done) {
    it('should activate solo matches', function (done) {
      var match = matches[0];

      startMatches.activateMatch(match)
        .then(function (activatedMatch) {
          expect(activatedMatch.status).to.equal('active');
          done();
        });


    });

    it('should activate joined h2h matches', function (done) {
      var match = matches[1];

      startMatches.activateMatch(match)
        .then(function (activatedMatch) {
          expect(activatedMatch.status).to.equal('active');
          done();
        });

    });

    it('should not activate unjoined h2h matches', function (done) {
      var match = matches[2];

      startMatches.activateMatch(match)
        .then(function (activatedMatch) {
          expect(activatedMatch).to.equal(undefined);
          done();
        });

    });

  });

  describe('rejectMatch', function () {
    it('should reject unjoined h2h matches', function (done) {
      var match = matches[2];

      startMatches.rejectMatch(match)
        .then(function (rejectedMatch) {
          expect(rejectedMatch.status).to.equal('rejected');
          done();
        });


    });

    it('should not reject joined h2h matches', function (done) {
      var match = matches[1];

      startMatches.rejectMatch(match)
        .then(function (rejectedMatch) {
          expect(rejectedMatch).to.equal(undefined);
          done();
        });
    });

    it('should not reject solo matches', function (done) {
      var match = matches[0];

      startMatches.rejectMatch(match)
        .then(function (rejectedMatch) {
          expect(rejectedMatch).to.equal(undefined);
          done();
        });
    });

  });


  describe('updateMatchState', function () {
    it('should change state for all matches starting that day', function (done) {
      Promise.map(matches, function (match) {
        return knex('matches')
                .where('m_id', match.m_id)
                .update({ status : 'pending'}, '*')
                .then(function (match) {
                  return match[0];
                });
      })
      .then( function(matches) {
        startMatches.updateMatchState(matches)
          .then(function (updatedMatches) {
            expect(updatedMatches[0].status).to.equal('active');
            expect(updatedMatches[1].status).to.equal('active');
            expect(updatedMatches[2].status).to.equal('rejected');
            done();
          });     
      });
    });

  });

});

