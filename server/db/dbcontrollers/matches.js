//matched controllers WORK OUT FOR HEAD TO HEADS!!!
var utils = require('./utils.js');

module.exports = function(knex) {
  var methods = {};

  //how to get multiple ids when have head to head matches--------//
  /*knex.select('name').from('users')
    .whereIn('id', [1, 2, 3])
    .orWhereIn('id', [4, 5, 6])*/
    //bit of an over kill dont at this point need to search user ID 
    //from table at this point! Left in as not hurting us to be tidied
  //-------------------create a match-----------------------------//
  
  methods.createMatch = function (userID, startFunds, type) {

      return knex.insert([
                        {
                        'creator_id': userID,
                        'starting_funds': startFunds,
                        'challengee': userID,
                        // 'startdate': startDate,
                        // 'enddate': endDate,
                        // 'status': status,
                        'type': type}], '*')
      .into('matches')
    .then(function (data) {
      return data;
    });

  };

  //---------------------get specific match-------------------------------//
   
  //function to get a match of a certain id
  methods.getMatch = function (matchID) {
    return knex.select().table('matches').where('m_id','=', matchID)
    .then(function (matchRow) {
      return matchRow;
    })
    .catch(function (err) {
      console.log('Error in getting a match',err);
    });
  };

  //---------------------------------------------------------------------//

  return methods;

};



