var express = require('express');
var router = express.Router();
var dbcontrollers = require('./../db/index.js').methods;

module.exports = function (knex) {

  router.param('userId', function (req, res, next, userId) {
    req.userId = userId;
    next();
  });

  //----------------get user information--------------------------------------//

  //route to get the user information for a specific user
  router.route('/:userId')
    .get(function (req, res) {
      console.log('in router');
      dbcontrollers.users.getUser(req.userId)
      .then(function (user) {
        return res.status(200).json({'message':'', 'data': user});
      })
      .catch(function (err) {
        console.log('Error getting one users info', err);
        return res.status(404).json({'message': err});
      });

    });

  //-----------------------------------------------------------//

  return router;

};
