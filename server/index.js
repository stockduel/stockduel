var express = require('express');
var app = express();

var knex = require('./db/index.js').knex; //decide which of these I want

var knex = require('./db/index.js');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var router = require('./routes/index');
var session = require('express-session');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;




app.get('/', function (req, res) {
  res.send('Hello Huggada!');
  //send request to amazon url s3 thing and pipe the response
  //reqiest.get('https://s3-us-west-1.amazonaws.com/stockduel/client/v0.1.0/index.html')
  //.pipe(res);
});

// Change session secret based on environment
var sessionSecret = process.env.sessionSecret || 'nofflePenguin';

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 67967000000 }
}));


//////////////////////////////
//                          //
//  FACEBOOK AUTH PORTION   //
//                          //
//////////////////////////////


app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  //check the user exists in the users table
  // knex.select().table('users').where('fbId','=', id)
  // .then(function (user) {
  //   done(null, user);
  // });
  
  // { id: '10156204225565315',
  //      email: '2muddybarefeet@gmail.com',
  //      gender: 'female',
  //      link: 'https://www.facebook.com/app_scoped_user_id/10156204225565315/',
  //      locale: 'en_GB',
  //      last_name: 'Rogers',
  //      first_name: 'Anna',
  //      timezone: -8,
  //      updated_time: '2015-12-04T21:53:13+0000',
  //      verified: true } 
  // }
});

passport.use(new FacebookStrategy({
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    // enableProof: false
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    //in here query the db to find or create
    // db.createUser(fbID, f_name, l_name, email, lastFbUpdate, fbVerified)
    // .then(function (user) {
    // })

// To keep the example simple, the user's Facebook profile is returned to
// represent the logged-in user.  In a typical application, you would want
// to associate the Facebook account with a user record in your database,
// and return that user instead.
// db.User
//   .findOrCreate({where: {
//     username: profile.displayName,
//     fbID: profile.id
//   }})
//   .then(function (user, created) {
//     // console.log(user.get({
//     //   plain: true
//     // }));
//     // console.log(created);
//   });

    console.log('-------ti-------', profile);
    return done(null, profile);
  }
));

//-------------------------------------------------------//

//remove the req.user property from the request and clear session
//NOT WORKING ATM :( 
app.get('/logout', function(req, res){
  console.log('LOGOUT@@@@');
  req.logout();
  res.redirect('/');
});

app.use(morgan('dev'));
app.use(bodyParser.json());

var router = require('./routes/index.js')(knex, passport);
app.use(router);

// app.get('/', function (req, res) {
  // res.send('Hello Huggada!');
//   //send request to amazon url s3 thing and pipe the response FOR S3 deployment leave commented at the moment
//   //reqiest.get('https://s3-us-west-1.amazonaws.com/stockduel/client/v0.1.0/index.html')
//   //.pipe(res);
// });

app.use('/', express.static(__dirname + './../client'));




app.listen(port, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.log("Express server listening on port", port);
  }
});

module.exports = app;
