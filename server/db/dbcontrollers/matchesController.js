var Promise = require('bluebird');

var tradesController = require('./tradesController');

module.exports = function (knex) {
  var module = {};
  var tradesCtrl = tradesController(knex);

  var PENDING = 'pending';
  var SOLO = 'solo';

  /* A match requires a creater (userid) {string}, starting funds {number}
   the type (solo or head to head) {string}, start date {date}, end date
   {date} */

  module.createMatch = function (userID, startFunds, type, startDate, endDate) {

    var challengee = null;
    if (type === SOLO) {
      challengee = userID;
    }

    return knex('matches').insert({
        'creator_id': userID,
        'starting_funds': startFunds,
        'startdate': startDate,
        'enddate': endDate,
        'status': PENDING,
        'challengee': challengee,
        'type': type
      }, '*')
      .then(function (match) {
        return match[0];
      });

  };

  module.joinMatch = function (matchID, userID) {
    return knex('matches').where({
        challengee: null,
        m_id: matchID
      })
      .update({
        challengee: userID,
      }, '*')
      .then(function (match) {
        if (match.length < 1) {
          return null;
        }
        return match[0];
      });
  };

  // Return all joinable matches

  module.getAllJoinableMatches = function () {
    return knex('matches').where({
      'status': PENDING,
      'challengee': null
    });
  };

  // Return all portfolios for a user. userid {string}
  module.getUsersPortfolios = function (userid) {
    return module.getUsersMatches(userid)
      .then(function (matches) {
        return Promise.map(matches, function (match) {
          return tradesCtrl.getPortfolio(userid, match.m_id);
        });
      });
  };

  // Return a specific match. matchID {string}

  module.getMatch = function (matchID) {
    return knex.select()
      .table('matches').where('m_id', '=', matchID)
      .then(function (match) {
        return match[0];
      });
  };

  // Get all matches for a user. userid {string}

  module.getUsersMatches = function (userID) {
    return knex.select()
      .table('matches')
      .where('creator_id', userID)
      .orWhere('challengee', userID)
      .then(function (matches) {
        return matches;
      });

  };

  return module;

};
