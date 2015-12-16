var express = require('express');
var router = express.Router();

module.exports = function (knex, passport) {

  router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/facebook'
  }));

  return router;
};
