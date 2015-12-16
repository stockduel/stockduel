var express = require('express');
var router = express.Router();
var usersController = require('../db/dbcontrollers/usersController');

module.exports = function (knex) {
  //initalize controller with knex connection
  usersCtrl = usersController(knex);

  router.param('userid', function (req, res, next, userid) {
    req.userid = userid;
    next();
  });

  router.route('/')
    .get(function (req, res) {
      var search = req.query.search;
      usersCtrl.searchUsers(search).then(function (response) {
        res.json({
          data: response
        });
      });
    });

  router.route('/:userid')
    .get(function (req, res) {
      var userid = req.userid;
      usersCtrl.getUser(userid).then(function (response) {
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
