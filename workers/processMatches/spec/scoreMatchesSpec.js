var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../db/index');

var scoreMatches = require('../scoreMatches/scoreMatches')(knex);
var matchesController = require('./../../../server/db/dbcontrollers/matchesController')(knex);
var tradesController = require('./../../../server/db/dbcontrollers/tradesController')(knex);


describe('scoreMatches Worker', function () {
  var today = new Date();
  var date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14);
  var date_before_start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 14);
  var end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 21.5);
  var other_end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 21.5);
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
  //match with different end date
  {
    starting_funds: 100000,
    type: 'head',
    startdate: date,
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
          if ( match.type === 'head') {
            return knex('matches')
              .where('m_id', '=', match.m_id)
              .update({challengee: otherUser.u_id,
                       status: 'active'
              }, '*')
              .then(function (match) {
                return match[0];
              });
          }
          return knex('matches')
            .where('m_id', '=', match.m_id)
            .update({status: 'active'}, '*')
            .then(function (match) {
              return match[0];
            });
        });
      })
      .then(function (readiedMatches) {
        matches = readiedMatches;
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
      })
      .orWhere({
        'match_id': matches[2].m_id
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
          return knex('users').where('email', user.email).del();
        });
      })
      .then(function () {
        done();
      })
      .catch(function (err) {
        console.log(err);
      });

  });

  describe('selectCompletingMatches', function () {
    it('should return all matches that are ending that day', function (done) {

      scoreMatches.selectCompletingMatches(other_end_date)
        .then(function (matches) {
          scoreMatches.selectCompletingMatches(end_date)
          .then(function (otherMatches) {
            expect(matches.length).to.equal(1);
            expect(otherMatches.length).to.equal(2);
            done(); 
          });
        });
    });

  });

  describe('getPortfolio', function (done) {
    it('should be able to get a user portfolio', function (done) {
      // var user = users[0];
      var match = matches[0];
      var trade = {
        shares: 100,
        symbol: 'FB'
      };

      tradesController.buy(match.creator_id, match.m_id, trade.shares, trade.symbol)
        .then(function (trade) {
          scoreMatches.getPortfolio(match.creator_id, match.m_id)
            .then(function (portfolio) {
              expect(portfolio).to.be.an('object');
              expect(portfolio.stocks.length).to.equal(1);
              expect(portfolio.available_cash).to.be.a('number');
              done();
            });
        });

    });

  });

  describe('determineWinners', function () {
    it('should declare the creator the winner when her portfolio is more valuable', function (done) {
      var match = matches[1];

      var trade = {
        shares: 100,
        symbol: 'FB'
      };

      tradesController.buy(match.creator_id, match.m_id, trade.shares, trade.symbol)
        .then(function (creatorTrade) {
          tradesController.buy(match.challengee, match.m_id, trade.shares * 2, trade.symbol)
          .then(function ( challengeeTrade) {
            scoreMatches.determineWinners([match])
            .then(function (scoredMatches) {
              var scoredMatch = scoredMatches[0];
              expect(scoredMatch.winner).to.equal(match.creator_id);
              done();
            });
          });
        });
    });

    it('should declare the challengee the winner when her portfolio is more valuable', function (done) {
      var match = matches[1];

      var trade = {
        shares: 100,
        symbol: 'FB'
      };

      tradesController.buy(match.creator_id, match.m_id, trade.shares * 5, trade.symbol)
        .then(function (creatorTrade) {
          tradesController.buy(match.challengee, match.m_id, trade.shares, trade.symbol)
          .then(function ( challengeeTrade) {
            scoreMatches.determineWinners([match])
            .then(function (scoredMatches) {
              var scoredMatch = scoredMatches[0];
              expect(scoredMatch.winner).to.equal(match.challengee);
              done();
            });
          });
        });
    });

    it('should declare no winner if there is a tie', function (done) {
      var match = matches[2];

      var trade = {
        shares: 100,
        symbol: 'FB'
      };

      tradesController.buy(match.creator_id, match.m_id, trade.shares, trade.symbol)
        .then(function (creatorTrade) {
          tradesController.buy(match.challengee, match.m_id, trade.shares, trade.symbol)
          .then(function ( challengeeTrade) {
            scoreMatches.determineWinners([match])
            .then(function (scoredMatches) {
              var scoredMatch = scoredMatches[0];
              expect(scoredMatch.winner).to.equal(null);
              done();
            });
          });
        });
    });

  });


  describe('recordWinner', function () {
    it('should update the winner column for the appropriate match', function (done) {
      // var user = users[0];
      var match = matches[1];

      scoreMatches.recordWinner(match.m_id, match.challengee)
        .then(function (scoredMatch) {
          expect(scoredMatch.winner).to.equal(match.challengee);
          done();
        });
    });

  });

});

