var Promise = require('bluebird');

var tradesController = require('./tradesController');

module.exports = function (knex) {
  var module = {};
  var tradesCtrl = tradesController(knex);

  var PENDING = 'pending';
  var SOLO = 'solo';

  /* A match requires a creater (userId) {string}, starting funds {number}
   the type (solo or head to head) {string}, start date {date}, end date
   {date} */

  module.createMatch = function (userId, startFunds, type, startDate, endDate, title) {

    var challengee = null;
    if (type === SOLO) {
      challengee = userId;
    }

    return knex('matches').insert({
        'creator_id': userId,
        'starting_funds': startFunds,
        'startdate': startDate,
        'enddate': endDate,
        'status': PENDING,
        'challengee': challengee,
        'title': title,
        'type': type
      }, '*')
      .then(function (match) {
        return match[0];
      });

  };

  module.joinMatch = function (matchId, userId) {
    return knex('matches').where({
        challengee: null,
        m_id: matchId,
        status: 'pending',
        type: 'head'
      })
      .update({
        challengee: userId
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

  // Return all portfolios for a user. userId {string}
  module.getUsersPortfolios = function (userId) {
    return module.getUsersMatches(userId)
      .then(function (matches) {
        return Promise.map(matches, function (match) {
          return tradesCtrl.getPortfolio(userId, match.m_id)
            .then(function (portfolio) {
              match.portfolio = portfolio;
              return match; // returns match object with all match info + corresponding portfolio
            });
        });
      });
  };

  // Return a specific match. matchId {string}

  module.getMatch = function (matchId) {
    return knex.select()
      .table('matches').where('m_id', '=', matchId)
      .then(function (match) {
        return match[0];
      });
  };

  // Get all matches for a user. userId {string}

  module.getUsersMatches = function (userId) {
    return knex.select()
      .table('matches')
      .where('creator_id', userId)
      .orWhere('challengee', userId)
      .then(function (matches) {
        return matches;
      });

  };

  return module;

};
