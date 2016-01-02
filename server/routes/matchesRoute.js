var express = require('express');
var router = express.Router();
var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex) {
  matchesController = matchesController(knex);

  router
    .param('matchId', function (req, res, next, matchId) {
      req.matchId = matchId;
      next();
    })
    .param('userId', function (req, res, next, userId) {
      req.userId = userId;
      next();
    });

  router.route('/')

//Get All Joinable Matches
//-------------------------
  .get(function (req, res) {

    matchesController.getAllJoinableMatches(req.user.u_id)
      .then(function (matches) {
        res.status(200).json({
          data: matches
        });
      })
      .catch(function (err) {
        res.status(404).json({
          message: err
        });
      });

  })

//Post New Match Details
//----------------------
  .post(function (req, res) {

    var userId = req.body.userId;
    var startFunds = req.body.startFunds;
    var startDate = req.body.startdate;
    var endDate = req.body.enddate;
    var type = req.body.type;
    var title = req.body.title;

    matchesController.createMatch(userId, startFunds, type, startDate, endDate, title)
      .then(function (match) {
        return res.status(200).json({
          data: match
        });
      })
      .catch(function (err) {
        return res.status(400).json({
          message: err
        });
      });

  });

//Get all of a Users Matches
//--------------------------
  router.route('/user/:userId')

    .get(function (req, res) {
      matchesController.getUsersMatches(req.userId)
        .then(function (matches) {
          res.status(200).json({
            data: matches
          });
        })
        .catch(function (err) {
          res.status(404).json({
            message: err
          });
        });

    });

//Join a Match
//------------------------
  router.route('/:matchId')

    .put(function (req, res) {
      var userId = req.session.passport.user.u_id;
      matchesController.joinMatch(req.matchId, userId)
        .then(function (match) {
          if (match === null) {
            res.status(400).json({
              message: 'unable to join match. Please try another'
            });
          } else {
            res.status(200).json({
              data: match
            });
          }
        });

    })

//Get a certain match
//----------------------
  .get(function (req, res) {
    matchesController.getMatch(req.matchId)
      .then(function (match) {
        res.status(200).json({
          data: match
        });
      })
      .catch(function (err) {
        res.status(404).json({
          message: err
        });
      });
  });

  return router;
};
