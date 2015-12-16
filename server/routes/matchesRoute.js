var express = require('express');
var router = express.Router();
var matchesController = require('../db/dbcontrollers/matchesController.js');


module.exports = function (knex) {
  matchesController = matchesController(knex);

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

  router.route('/')
    .post(function (req, res) {
      var userID = req.body.userID;
      var startFunds = req.body.startFunds;
      // var startDate = req.body.startDate;
      // var endDate = req.body.endDate;
      var type = req.body.type;

      matchesController.createMatch(userID, startFunds, type)
      .then(function (match) {
        return res.status(200).json({'message': 'Match added', 'data': match});
      })
      .catch(function (err) {
        console.log('------->',err);
        return res.status(400).json({'message': err});
      });

    });

  //----------------------------get all users matches----------------------------//

  router.route('/user/:userid')
    .get(function (req, res) {
      matchesController.getUsersMatches(req.userid)
      .then(function (matches) {
        res.status(200).json({'message': 'Returning matches', "data": matches});
      })
      .catch(function (err) {
        console.log('Error getting users matches',err);
        res.status(400).json({'message': err});
      });
    });


  //--------------------get details of a specific match----------------------------------//

  //testing http://localhost:8080/matches/1 on postman
  router.route('/:matchid')
    .get(function (req, res) {

      //get the details of specific match
      matchesController.getMatch(req.matchid)
      .then(function (match) {
        res.status(200).json({'message': 'Match retrieved', "data": match});
      })
      .catch(function (err) {
        console.log('Error getting user match',err);
        res.status(400).json({'message': err});
      });

    });

  //-----------------------------------------------------------//



  return router;
};
