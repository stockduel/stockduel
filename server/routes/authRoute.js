var express = require('express');
var router = express.Router();

var matchesController = require('../db/dbcontrollers/matchesController.js');

module.exports = function (knex, passport) {

  var matchesCtrl = matchesController(knex);

  router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/' //TODO: redirect to a better place if facebook fails
  }));

  return router;
};
