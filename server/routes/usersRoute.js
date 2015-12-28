var express = require('express');
var router = express.Router();
var usersController = require('../db/dbcontrollers/usersController');

module.exports = function (knex) {
  usersCtrl = usersController(knex);

  router.param('userId', function (req, res, next, userId) {
    req.userId = userId;
    next();
  });

  router.route('/')
    .get(function (req, res) {
      var search = req.query.search;
      usersCtrl.searchUsers(search)
        .then(function (response) {
          res.json({
            data: response
          });
        });
    });

  router.route('/:userId')
    .get(function (req, res) {
      var userId = req.userId;
      usersCtrl.getUser(userId).then(function (response) {
        if (response === null) {
          res.sendStatus(404);
        } else {
          res.json({
            data: response
          });
        }
      });
    });

  return router;
};
