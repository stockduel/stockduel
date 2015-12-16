var passport = require('passport');
var facebook = require('./facebookStrategy');

var knex = require('../../db/index');

passport.use(facebook(knex));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
