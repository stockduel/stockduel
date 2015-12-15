var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var Promise = require('bluebird');
var knex = require('knex');
var config = require('../../db/knexfile');
var app = require('../../index');

describe('matches routes', function () {

  // ============= Test Data ============= \\

var users = {
  username: 'annaUser',
  password: 'annaPassword',
  name: 'anna',
  email: 'anna@annars'};

var matches = {
  creator_id: 1,
  starting_funds: 100000,
  challengee: 1,
  startdate: 'Sat Dec 12 2015 16:55:38 GMT-0800 (PST)',
  enddate: 'Fri Jan 29 2016 00:00:00 GMT-0800 (PST)',
  status: 'in progress',
  type: 'TEST'
};

var match1 = {
  // userID: 1,
  startFunds: '100000',
  type: 'solo match'
};

  // ============= Make table data ============= \\

  before(function (done) {
    //insert users into DB
    knex = knex(config['development']);

    return knex('users').insert(users, '*')
    .then(function (user) {
      users = user[0];
      matches.creator_id = user[0].u_id;
      matches.challengee = user[0].u_id;
      match1.userID = user[0].u_id;
      done();
    });

  });


  // ============= Remove table data ============= \\

  after(function (done) {
    //remove trades
    return knex('matches').where('creator_id', users.u_id).del()
    .then(function(arrayOfMatchDeletionResults) {
      return knex('users').where('email', 'anna@annars').del();
    })
    .then(function(matchesArr) {
      matches = matchesArr[0];
      console.log('matches after hook');
      done();
    });
  });


  // ============= Tests ============= \\


  describe('POST /matches/', function () {

    it('responds with a 200 (OK)', function (done) {
      request(app)
        .post('/matches/')
        .send(match1)
        .expect(200, done);
    });

    it('responds with the matches', function (done) {
      request(app)
        .post('/matches/')
        .send(match1)
        .expect(function (response) {
          var matchsRes = response.body;
          matches = matchsRes.data;
          expect(matchsRes).to.be.a('object');
          expect(matchsRes.data.creator_id).to.be.a('number');
        })
        .expect(200, done);
    });
  });

  describe('GET /matches/:matchid', function () {

    it('responds with a 200 (OK)', function (done) {
      var matchid = matches.m_id;

      request(app)
        .get('/matches/' + matchid)
        .expect(200, done);

    });

    it('responds with the match', function (done) {
      var matchid = matches.m_id;
      request(app)
        .get('/matches/' + matchid)
        .expect(function (response) {
          var match = response.body;
          expect(match).to.be.a('object');
          expect(match.data.creator_id).to.be.a('number');
          expect(match.data.m_id).to.equal(matchid);
        })
        .expect(200, done);

    });

  });


  describe('GET /matches/user/:userid', function () {

    //get user matches
    it('responds with a 200 (OK)', function (done) {
      var matchid = matches.m_id;
      var userid = users.u_id;

      request(app)
        .get('/matches/user/' + userid)
        .expect(200, done);
    });

    it('responds with the match', function (done) {

      var matchid = matches.m_id;
      var userid = users.u_id;

      request(app)
        .get('/matches/user/' + userid)
        .expect(function (response) {
          var userMatches = response.body;
          expect(userMatches.data).to.be.a('array');
          expect(userMatches.data[0].status).to.equal('in progress');
        })
        .expect(200, done);
    });

  });




});


