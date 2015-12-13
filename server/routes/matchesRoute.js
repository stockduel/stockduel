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
      // console.log('YOOYOYOOY')
      res.json({
        matchid: req.matchid
      });
    })
    .post(function (req, res) {

    });


  return router;
};
