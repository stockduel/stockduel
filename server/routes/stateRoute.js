var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex) {

  var matchesCtrl = matchesController(knex);

  router.get('/', function (req, res) {
    var userId = req.user.u_id;
    matchesCtrl.getAllMatches(userId).then(function (matches) {
      var currentMatchId = matches.length ? matches[0].matchId : null;
      res.json({
        currentMatchId: currentMatchId,
        userId: userId,
        matches: matches
      });
    });
  });

  return router;
};
