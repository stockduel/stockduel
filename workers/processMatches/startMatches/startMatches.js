var Promise = require('bluebird');
var request = require('request');
var knex = require('./../db/index');


module.exports = function (knex) {
  var module = {};
 
//Seached for any matches that start today and update status depending on if it has a chalangee or not
//------------------------------------------------------------------------------------------------------
  module.startMatches = function (providedDate) {
    //formulate date to look for
    var today = new Date();
    var date = providedDate || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14);
      //get all matches that should start today
      module.selectPendingMatches(date)
      .then( function(matches){
        return module.updateMatchState(matches);
      })
      .catch( function (err) {
        console.error(err);
      });
  };

//Select all pending matches that start on passed in date (when used this is looking for all matches starting today)
  module.selectPendingMatches = function (date) {
    return knex('matches')
      .where({
        status: 'pending',
        startdate: date
      });
  };

//Decide if a match can become active or not depending on whether it has a chalengee
  module.updateMatchState = function (matches) {
    return Promise.map(matches, function (match) {
      if( match.challengee ) {
        return module.activateMatch(match);
      } else {
        return module.rejectMatch(match);
      }
    });
  };

//Update the status of a match if it starts to day anf it has a challengee
  module.activateMatch = function (match) {
    return knex('matches')
      .where('m_id', '=', match.m_id)
      .andWhere('status', '=', 'pending')
      .andWhereNot({challengee: null})
      .update({status: 'active'}, '*')
      .then( function (match) {
        return match[0];
      })
      .catch( function (err) {
        console.error(err);
      });
  };

//If the match has no challengee it can't start so reject it
  module.rejectMatch = function (match) {
    return knex('matches')
      .where('m_id', '=', match.m_id)
      .andWhere({status : 'pending'})
      .andWhere({challengee : null})
      .update({status: 'rejected'}, '*')
      .then( function (rejectedMatch) {
        return rejectedMatch[0];
      })
      .catch( function (err) {
        console.error(err);
      });
  };

  return module;
};
