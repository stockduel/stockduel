//required by server/index.js

var passport = require('passport');
var facebook = require('./facebookStrategy');

var knex = require('../../db/index');

//pass knex connection to facebookStrategy file
//format to query facebook returned as constructor function
passport.use(facebook(knex));

//PASSPORT docs
//The serialization and deserialization 
//logic is supplied by the application, allowing the 
//application to choose an appropriate database and/or 
//object mapper, without imposition by the authentication layer.

//Serialize and Deserialize user not used specifically but REQUIRED by passport and will break without it
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
