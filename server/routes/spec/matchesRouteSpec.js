var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app = require('../../index');

describe('/matches/:matchid', function () {
  describe('GET', function () {
    var matchid = 1234;

    it('responds with a 200 (OK)', function (done) {
      request(app)
        .get('/matches/' + matchid)
        .expect(200, done);
    });

    it('responds with the match', function (done) {
      request(app)
        .get('/matches/' + matchid)
        .expect(200, {
          matchid: matchid
        }, done);
    });
  });
});

describe('/matches/:matchid/:userid', function () {
  describe('GET', function () {
    var matchid = 1234;
    var userid = 3456;

    it('responds with a 200 (OK)', function (done) {
      request(app)
        .get('/matches/' + matchid + '/' + userid)
        .expect(200, done);
    });

    it('responds with the match', function (done) {
      request(app)
        .get('/matches/' + matchid + '/' + userid)
        .expect(200, {
          matchid: matchid,
          userid: userid
        }, done);
    });
  });
});
