var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex) {
  var matchesCtrl = matchesController(knex);

//Get all of the users portfolios
//-----------------------------------
  router.get('/', function (req, res) {
    var userId = req.user.u_id;
    matchesCtrl.getUsersPortfolios(userId).then(function (matches) {
        // return object with keys that conform to redux state object
        res.json({
          currentMatchId: '',
          error: null,
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
