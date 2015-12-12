//matched controllers WORK OUT FOR HEAD TO HEADS!!!
module.exports = function (knex) {
  var module = {};

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
        'title': title,
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

  return module;

};
