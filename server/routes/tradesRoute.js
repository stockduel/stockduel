var express = require('express');
var router = express.Router();
var tradesController = require('../db/dbcontrollers/tradesController.js');

module.exports = function (knex) {
  tradesController = tradesController(knex);

  router
    .param('matchid', function (req, res, next, matchid) {
      req.matchid = matchid;
      next();
    })
    .param('userid', function (req, res, next, userid) {
      req.userid = userid;
      next();
    });

  router.route('/:matchid/:userid')
    .get(function (req, res) {
      console.log('in route', req.userid, req.matchid)
      tradesController.getPortfolio(req.userid, req.matchid)
        .then(function (portfolio) {
          res.status(200).json({
            data: portfolio
          });
        })
        .catch(function (err) {
          res.status(400).json({
            message: err
          });
        });
    })

  .post(function (req, res) {
    console.log('in route BUY server', req.matchid)
    var userID = req.userid;
    var matchID = req.matchid;
    var numShares = req.body.numShares;
    var action = req.body.action;
    var stockTicker = req.body.stockTicker;
    var actions = {
      'buy': tradesController.buy,
      'sell': tradesController.sell
    };

    if (actions[action] === undefined) {
      res.status(400).json({
        message: 'Not a valid action'
      });
    }

    actions[action](userID, matchID, numShares, stockTicker)
      .then(function (data) {
        res.status(200).json({
          data: data
        });
      })
      .catch(function (err) {
        res.status(400).json({
          message: err
        });
      });

  });

  //-----------------------------------------------------------//

  return router;
};
