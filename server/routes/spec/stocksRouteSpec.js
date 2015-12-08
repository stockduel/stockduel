var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');

var app = require('../../index');

describe('/stocks/:symbol', function () {
  describe('GET', function () {
    var validSymbol = 'FB';
    var invalidSymbol = 'FKSYMBL';

    it('responds with a 200 (OK) for valid symbols', function (done) {
      request(app)
        .get('/stocks/' + validSymbol)
        .expect(200, done);
    });

    xit('responds with a 404 (NOT FOUND) for invalid symbols', function (done) {
      request(app)
        .get('/stocks/' + invalidSymbol)
        .expect(404, done);
    });

    it('responds with the requested stock', function (done) {
      request(app)
        .get('/stocks/' + validSymbol)
        .expect(200, {
          symbol: validSymbol
        }, done);
    });
  });
});

describe('/stocks/?search=', function () {
  describe('GET', function () {
    var search = 'FB';

    it('responds with a 200 (OK)', function (done) {
      request(app)
        .get('/stocks/?search=' + search)
        .expect(200, done);
    });

    it('responds with stocks matching the query', function (done) {
      request(app)
        .get('/stocks/?search=' + search)
        .expect({
          search: search
        }, done);
    });
  });
});
