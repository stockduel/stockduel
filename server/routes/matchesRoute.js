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

  router.route('/')

  .get(function (req, res) {
    matchesController.getAllJoinableMatches()
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

  .post(function (req, res) {
    var userID = req.body.userID;
    var startFunds = req.body.startFunds;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var type = req.body.type;

    matchesController.createMatch(userID, startFunds, type, startDate, endDate)
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

  router.route('/user/:userid')
    .get(function (req, res) {
      matchesController.getUsersMatches(req.userid)
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

  router.route('/:matchid')
    .put(function (req, res) {
      var userID = req.body.userID;

      matchesController.joinMatch(req.matchid, userID)
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

  .get(function (req, res) {
    matchesController.getMatch(req.matchid)
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
