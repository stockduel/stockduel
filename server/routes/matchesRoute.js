var express = require('express');
var router = express.Router();
var dbcontrollers = require('./../db/index.js').methods;

module.exports = function (knex) {

  router
    .param('matchid', function (req, res, next, matchid) {
      req.matchid = matchid;
      next();
    })
    .param('userid', function (req, res, next, userid) {
      req.userid = userid;
      next();
    });

  //--------------------make a match---------------------------------//

  router.route('/matches')
    .post(function (req, res) {
      var userID = req.body.userID;
      var startFunds = req.body.startFunds;
      // var startDate = req.body.startDate;
      // var endDate = req.body.endDate;
      var type = req.body.type;

      dbcontrollers.matches.createMatch(userID, startFunds, type)
      .then(function (match) {
        res.status(200).json({'message': 'Match added', "data": match});
      })
      .catch(function (err) {
        res.status(404).json({'message': err});
      });

    });

  //--------------------get details of a specific match----------------------------------//

  //testing http://localhost:8080/matches/1 on postman
  router.route('/:matchid')
    .get(function (req, res) {

      //get the details of specific match
      dbcontrollers.matches.getMatch(req.matchid)
      .then(function (match) {
        console.log('MATCH GOT', match);
        res.status(200).json({'message': 'Match retrieved', "data": match});
      })
      .catch(function (err) {
        console.log('Error getting user match',err);
        res.status(404).json({'message': err});
      });

    });

  //-----------------------------------------------------------//
  
  return router;

};
