var express = require('express');
var router = express.Router();



module.exports = function (knex, passport) {

router.route('/facebook')
  .get(passport.authenticate('facebook', { scope: ['email'] }));

router.route('/facebook/callback')
  .get(passport.authenticate('facebook', { failureRedirect: '/', failureFlash: true, scope:['email'] }),
    function(req, res) {
      var fbID = req.user.id;
      // var name = req.user.json;
      console.log('login Success!!!!------->', req.body, fbID);

      // var userName = req.body.userName;
      // var password = req.body.password;
      // var name = req.body.name;
      // var email = req.body.email;
      // return dbcontrollers.users.createUser(userName, password, name, email)
      // .then(function (user) {
      //   //thought would send back the user information becuase it is either 
      //   //the user info or the message that the user exists
      //   return res.status(200).json({'message':'User authenticated', 'data': user});
      // })
      // .catch(function (err) {
      //   console.log('Error posting user to database', err);
      //   return res.status(404).json({'message': err});
      // });
      res.send({"message":"HELLO WORLD"});
  });

  return router;

};
