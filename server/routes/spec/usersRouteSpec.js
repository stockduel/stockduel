var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app = require('../../index');

describe('/users', function () {
  describe('GET', function () {
    var userid = 1234;

    it('responds with a 200 (OK)', function (done) {
      request(app)
        .get('/users/' + userid)
        .expect(200, done);
    });

    it('responds with the user', function (done) {
      request(app)
        .get('/users/' + userid)
        .expect(200, {
          userid: userid
        }, done);
    });
  });
});
