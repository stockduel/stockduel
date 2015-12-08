var express = require('express');
var router = express.Router();

router.param('userid', function (req, res, next, userid) {
  req.userid = userid;
  next();
});

router.route('/:userid')
  .get(function (req, res) {
    res.json({
      userid: req.userid
    });
  });

module.exports = router;
