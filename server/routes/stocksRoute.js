var express = require('express');
var router = express.Router();
var stocksController = require('../db/dbcontrollers/stocksController');

module.exports = function (knex) {
  stocksController = stocksController(knex);

  router.param('symbol', function (req, res, next, symbol) {
    req.symbol = symbol;
    next();
  });

  router.route('/')
    .get(function (req, res) {
      var search = req.query.search;
      stocksController.searchStock(search).then(function (response) {
        res.json({
          data: response
        });
      });

    });

  router.route('/:symbol')
    .get(function (req, res) {
      var symbol = req.symbol;
      stocksController.getStock(symbol).then(function (response) {
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

