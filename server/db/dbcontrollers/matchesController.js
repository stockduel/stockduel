var Promise = require('bluebird');

var tradesController = require('./tradesController');

module.exports = function (knex) {
  var module = {};
  var tradesCtrl = tradesController(knex);

  //how to get multiple ids when have head to head matches--------//
  /*knex.select('name').from('users')
    .whereIn('id', [1, 2, 3])
    .orWhereIn('id', [4, 5, 6])*/
  //bit of an over kill dont at this point need to search user ID 
  //from table at this point! Left in as not hurting us to be tidied
  //-------------------create a match-----------------------------//

  module.createMatch = function (userID, startFunds, type) {

    //TODO: match logic
    var nextWeek = Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
    var startDate = new Date();
    var endDate = nextWeek;
    var status = 'in progress';
    var title = 'solo match';

    return knex('matches').insert({
        'creator_id': userID,
        'starting_funds': startFunds,
        'challengee': userID,
        'startdate': startDate,
        'enddate': endDate,
        'status': status,
        'type': type
      }, '*')
      .then(function (match) {
        return match[0];
      });

  };

  module.getAllMatches = function (userid) {
    return module.getUsersMatches(userid)
      .then(function (matches) {
        return Promise.map(matches, function (match) {
          return tradesCtrl.getPortfolio(userid, match.m_id);
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  //---------------------get specific match-------------------------------//

  //function to get a match of a certain id
  module.getMatch = function (matchID) {
    return knex.select()
      .table('matches').where('m_id', '=', matchID)
      .then(function (match) {
        return match[0];
      });
  };

  //---------------------------------------------------------------------//

  module.getUsersMatches = function (userID) {
    // console.log('MATCH', userID)
    return knex.select()
      .table('matches')
      .where('creator_id', userID)
      .orWhere('challengee', userID)
      .then(function (matches) {
        return matches;
      });

  };

  //---------------------------------------------------------------------//

  return module;

};
