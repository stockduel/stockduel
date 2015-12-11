var express = require('express');
var router = express.Router();
var dbcontrollers = require('./../db/index.js').methods;


module.exports = function (knex) {
  
  //----------------------get user portfolio------------------------------------//

  router
    .param('matchid', function (req, res, next, matchid) {
      req.matchid = matchid;
      next();
    })
    .param('userid', function (req, res, next, userid) {
      req.userid = userid;
      next();
    });


 //----------------------get user portfolio-----------------------------------//

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
    //NOT USING THE REQ PARAMS here- do we want to use req params here?! might just bundle all in the body!
    .post(function (req, res) {
      console.log(req.body);
      var userID = req.userid;
      var matchID = req.matchid;
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
