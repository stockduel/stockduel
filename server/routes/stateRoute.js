var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex) {

  var matchesCtrl = matchesController(knex);

  router.get('/', function (req, res) {
    var userID = req.user.u_id;
    matchesCtrl.getAllMatches(userID).then(function (matches) { // array of objects: see tradesController at module.getPortfolio for objects' formats
      var currentMatchID = matches[0] ? matches[0].matchID : null; // matchID !== matchId (undefined)
      
      // return object with keys that conform to redux state object
      res.json({
        currentMatchID: currentMatchID,
        userID: userID,
        matches: matches
      });
    });
  });

  return router;
};
