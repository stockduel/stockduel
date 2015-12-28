var Promise = require('bluebird');
var request = require('request');
var knex = require('./../db/index');
var tradesController = require('./../../../server/db/dbcontrollers/tradesController')(knex);

module.exports = function (knex) {
  var module = {};
  module.scoreMatches = function (providedDate) {
    //formulate the date to look for
    var today = new Date();
    var date = providedDate || new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14);
    //get all matches that are active and ending on the provided date
    selectCompletingMatches( date )
      .then( function (matches) {
        return determineWinners(matches);
      })
      .catch( function ( err ) {
        console.error(err);
      });
  }

  module.selectCompletingMatches = function (date) {
    return knex('matches')
      .where({
        status: 'active',
        enddate: date
      });
  }

  module.determineWinners = function (matches) {
    return Promise.map(matches, function (match) {
      if( match.creator_id === match.challengee ) {
           return recordWinner(match.m_id, match.creator_id);
      } else {
        //get creator's portfolio
        return module.getPortfolio(match.creator_id, match.m_id)
        .then (function (creatorPortfolio) {
          //get challengee's portfolio
          return module.getPortfolio(match.challengee, match.m_id)
          .then (function (challengeePortfolio) {
            //evaluate portfolio values against each other
            if( creatorPortfolio.totalValue > challengeePortfolio.totalValue ) {
              return module.recordWinner(match.m_id, match.creator_id);
            } else if ( challengeePortfolio.totalValue > creatorPortfolio.totalValue ) {
              return module.recordWinner(match.m_id, match.challengee);
            } else {
              //if there's a tie, we will leave winner null
              return module.recordWinner(match.m_id, null);
            }
          });
        });
      }
    });
  }

  module.getPortfolio = function (userId, matchId) {
    return tradesController.getPortfolio(userId, matchId);
  }

  module.recordWinner = function (matchId, userId) {
    return knex('matches')
      .where('m_id', '=', matchId)
      .update({
        status: 'complete',
        winner: userId
      }, '*')
      .then(function (match) {
        return match[0];
      });
  }

  return module;

};
