var express = require('express');
var router = express.Router();

module.exports = function (knex) {

  router.route('/facebook')
    .get(function (req, res) {

    });

  router.route('/facebook/callback')
    .get(function (req, res) {

    });

  return router;
};
