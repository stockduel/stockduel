var Promise = require('bluebird');
var request = require('request');
var knex = require('./../db/index');


module.exports = function (knex) {
  var module = {};
  
  module.startMatches = function (providedDate) {
    console.log('kicking off match starting job');
    //formulate date to look for
    var today = new Date();
    var date = providedDate || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30);
    //get all matches that should start today
      module.selectPendingMatches(date)
      .then( function(matches){
        return module.updateMatchState(matches);
      }) 
      .catch( function (err) {
        console.error(err);
      });
  }

  module.selectPendingMatches = function (date) {
    console.log('finding pending matches');
    return knex('matches')
      .where('status', 'pending')
      .then( function(matches) {
        return matches.filter(function(match) {
          return Date.parse(match.startdate) <= Date.parse(date);
        });
      });
      // .andWhere('startdate', '<=', date);
  }

  module.updateMatchState = function (matches) {
    console.log('updating match states');
    return Promise.map(matches, function (match) {
      if( match.challengee ) {
        return module.activateMatch(match);
      } else {
        return module.rejectMatch(match);
      }
    });
  }

  module.activateMatch = function (match) {
    return knex('matches')
      .where('m_id', '=', match.m_id)
      .andWhere('status', '=', 'pending')
      .andWhereNot({challengee: null})
      .update({status: 'active'}, '*')
      .then( function (match) {
        console.log('activating match');
        return match[0];
      })
      .catch( function (err) {
        console.error(err);
      });  
  }

  module.rejectMatch = function (match) {
    return knex('matches')
      .where('m_id', '=', match.m_id)
      .andWhere({status : 'pending'})
      .andWhere({challengee : null})
      .update({status: 'rejected'}, '*')
      .then( function (rejectedMatch) {
        console.log('rejecting match');
        return rejectedMatch[0];
      })
      .catch( function (err) {
        console.error(err);
      });
  }

  return module;
};
