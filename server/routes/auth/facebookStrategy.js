var TRAVIS = process.env.TRAVIS || false;

//don't use this file if it's travis
if(!TRAVIS) {
  var FACEBOOK_KEYS = require('./_fb_keys.js');
}
var FacebookStrategy = require('passport-facebook');

var usersController = require('../../db/dbcontrollers/usersController');

var clientID = TRAVIS ? process.env.CLIENT_ID : FACEBOOK_KEYS.CLIENT_ID;
var clientSecret = TRAVIS ? process.env.CLIENT_SECRET : FACEBOOK_KEYS.CLIENT_SECRET;
console.log('clientID is ', clientID);
console.log('clientSecret is ', clientSecret);

module.exports = function (knex) {
  var usersCtrl = usersController(knex);
  return new FacebookStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
      enableProof: false,
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function (accessToken, refreshToken, profile, done) {
      var user = {
        username: profile.name.givenName,
        name: [profile.name.givenName, profile.name.familyName].join(' '),
        email: profile.emails[0].value,
        password: 'stockduel'
      };
      // console.log(accessToken, refreshToken, user);
      usersCtrl.findOrCreateUser(user.username, user.password, user.name, user.email);

      return done(null, profile);
    }
  );
};
