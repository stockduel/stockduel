var express = require('express');
var router = express.Router();

module.exports = function (knex) {
  router
    .param('matchid', function (req, res, next, matchid) {
      req.matchid = matchid;
      next();
    })
    .param('userid', function (req, res, next, userid) {
      req.userid = userid;
      next();
    });

  router.route('/:matchid')
    .get(function (req, res) {
      res.json({
        matchid: req.matchid
      });
    })
    .post(function (req, res) {

    });

  router.route('/:matchid/:userid')
    .get(function (req, res) {
      res.json({
        matchid: req.matchid,
        userid: req.userid
      });
    })
    .post(function (req, res) {

    });

  return router;
};
