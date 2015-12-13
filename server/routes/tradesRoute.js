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


  // //----------------------get user portfolio-----------------------------------//

  router.route('/:matchid/:userid')
  .get(function (req, res) {
    tradesController.getTrades(req.userid, req.matchid)
    .then(function (portfolio) {
      console.log('User portfolio', portfolio);
      return res.status(200).json({'message': 'Retrieved portfolio', 'data': portfolio});
    })
    .catch(function (err) {
      console.log('Error getting portfolio');
      return res.status(404).json({'message': 'Error getting portfolio', 'err': err});
    });
  })

   //----insert data to the trades table----//
  .post(function (req, res) {

    var userID = req.userid;
    var matchID = req.matchid;
    var numShares = req.body.numShares;
    var action = req.body.action;
    var stockTicker = req.body.stockTicker;

    if (action === 'buy') {

      tradesController.buy(userID,matchID,numShares,action,stockTicker)
      .then(function (data) {
        return res.status(200).json({'message': 'Processed trade', 'data': data});
      })
      .catch(function (err) {
        console.log(err);
        return res.status(400).json({'message': 'Not valid trade', 'err': err});
      });

    } else {

      tradesController.sell(userID,matchID,numShares,action,stockTicker)
      .then(function (data) {
        return res.status(200).json({'message': 'Processed trade', 'data':data});
      })
      .catch(function (err) {
        return res.status(400).json({'message': 'Not valid trade', 'err': err});
      });
    }
  });

    //-----------------------------------------------------------//

  return router;
};
