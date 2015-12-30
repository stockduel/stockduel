var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex) {
  var matchesCtrl = matchesController(knex);

  router.get('/', function (req, res) {
    var userId = req.user.u_id;
    matchesCtrl.getUsersPortfolios(userId).then(function (matches) {
        var currentmatchId = matches[0] ? matches[0].m_id : null;
        // return object with keys that conform to redux state object
        res.json({
          currentMatchId: currentmatchId,
          userId: userId,
          matches: matches
        });
      })
      .catch(function (err) {
        res.status(400).json({
          message: err
        });
      });
  });

  return router;
};
