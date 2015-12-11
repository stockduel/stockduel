//matched controllers WORK OUT FOR HEAD TO HEADS!!!
var utils = require('./utils.js');

module.exports = function(knex) {
  var methods = {};

  //how to get multiple ids when have head to head matches--------//
  /*knex.select('name').from('users')
    .whereIn('id', [1, 2, 3])
    .orWhereIn('id', [4, 5, 6])*/

  //-------------------create a match-----------------------------//
  
  methods.createMatch = function (userID, startFunds, type) {

    return knex.select('u_id').from('users').where('users.u_id', userID)
    .then(function (user) {
      //THIS will need to be atered when head to head not 100% sure how!
      return user[0].u_id;
    })
    .then(function (userId) {
      //not necessary for MVP but need to be added when have muliple matches
      //----way to compare the times and to calculate the status-------
      // var status = utils.getStatus(startDate, endDate);
      // console.log('utils.methods--------', status);

      //insert the data into the matches table
      return knex.insert([
                        {
                        'creator_id': userId,
                        'starting_funds': startFunds,
                        'challengee': userId,
                        // 'startdate': startDate,
                        // 'enddate': endDate,
                        // 'status': status,
                        'type': type}], '*')
      .into('matches');
    })
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