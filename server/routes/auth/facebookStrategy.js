var FacebookStrategy = require('passport-facebook');

var usersController = require('../../db/dbcontrollers/usersController');

var clientID = process.env.CLIENT_ID || require ('./_fb_keys').CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET || require ('./_fb_keys').CLIENT_SECRET;

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
        password: accessToken
      };

      return usersCtrl.findOrCreateUser(user.username, user.password, user.name, user.email)
        .then(function (profile) {
          var user = {
            u_id: profile.u_id,
            username: profile.username,
            name: profile.name,
            email: profile.email
          };
          done(null, user);
        })
        .catch(function (err) {
          done(err, null);
        });
    }
  );
};
