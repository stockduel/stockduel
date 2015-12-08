var express = require('express');
var router = express.Router();
var stocksController = require('../db/dbcontrollers/stocksController');

module.exports = function (knex) {
  
  //----------------------get user portfolio------------------------------------//

  router.route('/:matchid/:userid')
    .get(function (req, res) {
      dbcontrollers.trades.getTrades(req.userid, req.matchid)
      .then(function (portfolio) {
        console.log('User portfolio', portfolio);
        return res.status(200).json({'message': 'Retrieved portfolio', 'data': portfolio});
      })
      .catch(function (err) {
        console.log('Error getting portfolio');
        return res.status(404).json({'message': 'Error getting portfolio', 'data': err});
      });

    })

    //----insert data to the trades table----//
    //using ('/:matchid/:userid') route from above
    //NOT USING THE REQ PARAMS here- figured better to use in the req body?!  http://localhost:8080/matches/2/2 url in postman
    .post(function (req, res) {

      var userID = req.body.userID;
      var matchID = req.body.matchID;
      var numShares = req.body.numShares;
      var action = req.body.action;
      var stockTicker = req.body.stockTicker;

      if (action === 'buy') {

        dbcontrollers.trades.buy(userID,matchID,numShares,action,stockTicker)
        .then(function (data) {
          return res.status(200).json({'message': 'Processed trade', 'data': data});
        })
        .catch(function (err) {
          return res.status(200).json({'message': 'Not valid trade', 'data': err});
        });

      } else {

        dbcontrollers.trades.sell(userID,matchID,numShares,action,stockTicker)
        .then(function (data) {
          return res.status(200).json({'message': 'Processed trade', 'data':data});
        })
        .catch(function (err) {
          return res.status(200).json({'message': 'Not valid trade', 'data': err});
        });
      }

    });

    //-----------------------------------------------------------//

  return router;

};
