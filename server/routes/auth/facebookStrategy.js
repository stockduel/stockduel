var TRAVIS = process.env.TRAVIS || false;

if(!TRAVIS) {
  var FACEBOOK_KEYS = require('./_fb_keys.js');
}
var FacebookStrategy = require('passport-facebook');

var usersController = require('../../db/dbcontrollers/usersController');

module.exports = function (knex) {
  var usersCtrl = usersController(knex);
  return new FacebookStrategy({
      clientID: FACEBOOK_KEYS.CLIENT_ID,
      clientSecret: FACEBOOK_KEYS.CLIENT_SECRET,
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
