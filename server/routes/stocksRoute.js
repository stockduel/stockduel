var express = require('express');
var router = express.Router();

router.param('symbol', function (req, res, next, symbol) {
  req.symbol = symbol;
  next();
});

router.route('/')
  .get(function (req, res) {
    var search = req.query.search;
    res.json({
      search: search
    });
  });

router.route('/:symbol')
  .get(function (req, res) {
    res.json({
      symbol: req.symbol
    });
  });

module.exports = router;
