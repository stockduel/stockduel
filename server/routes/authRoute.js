var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex, passport) {

  var matchesCtrl = matchesController(knex);

  router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/facebook/callback', passport.authenticate('facebook'), function (req, res) {
    var userId = req.user.u_id;
    matchesCtrl.getAllMatches(userId).then(function (matches) {
      res.json({
        user: req.user,
        matches: matches
      });
    });
  });

  return router;
};
