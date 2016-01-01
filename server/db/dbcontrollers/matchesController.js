var Promise = require('bluebird');

var tradesController = require('./tradesController');

module.exports = function (knex) {
  var module = {};
  var tradesCtrl = tradesController(knex);

  var PENDING = 'pending';
  var ACTIVE = 'active';
  var SOLO = 'solo';

  // ensure start dates are stored consistently in db
  function standardizeStart(date){
    var START_HOUR = 14;
    var START_MIN = 30;
    var newDate = new Date(date);
    var start = new Date( Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), START_HOUR, START_MIN) );
    console.log(start);
    return start.toISOString();
  }

  // ensure end dates are stored consistently in db 
  function standardizeEnd(date){
    var END_HOUR = 21;
    var newDate = new Date(date);
    var end = new Date( Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), END_HOUR) );
    console.log(end);
    return end.toISOString();
  }

  /* A match requires a creater (userId) {string}, starting funds {number}
   the type (solo or head to head) {string}, start date {date}, end date
   {date} */

  module.createMatch = function (userId, startFunds, type, startDate, endDate, title) {

    var challengee = null;
    var today = standardizeStart(Date.now());
    var status = PENDING;

    startDate = standardizeStart(startDate);
    endDate = standardizeEnd(endDate);

    if (startDate >= endDate){
      throw new Error('Start date can not occur before end date.');
    }

    if (startDate < today){
      throw new Error('Start date can be before today.');
    }

    if (type === SOLO) {
      challengee = userId;
      if (startDate === today){
        status = ACTIVE;
      }
    }

    return knex('matches').insert({
      'creator_id': userId,
      'starting_funds': startFunds,
      'startdate': startDate,
      'enddate': endDate,
      'status': status,
      'challengee': challengee,
      'title': title,
      'type': type
    }, '*')
    .then(function (match) {
      return match[0];
    });

  };

//Join a Match: insert a user into the previously null challengee matches table field. matchId {string}, userId {string}
//-------------------------------------------------------------------------------------
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

//Return all joinable matches
//----------------------------------
  module.getAllJoinableMatches = function (userId) {
    return knex('matches').where({
      'status': PENDING,
      'challengee': null
    })
    .andWhereNot('creator_id', userId);
  };

// Return all portfolios for a user. userId {string}
//--------------------------------------------------------
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
//----------------------------------------------
  module.getMatch = function (matchId) {
    return knex.select()
      .table('matches').where('m_id', '=', matchId)
      .then(function (match) {
        return match[0];
      });
  };

// Get all matches for a user. userId {string}
//----------------------------------------------
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
