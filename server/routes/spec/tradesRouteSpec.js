var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var Promise = require('bluebird');
var knex = require('knex');
var config = require('../../db/knexfile');
var app = require('../../index');

var users = [{
  username: 'annaUser',
  password: 'annaPassword',
  name: 'anna',
  email: 'anna@annars'
}, {
  username: 'kateUser',
  password: 'katePassword',
  name: 'kate',
  email: 'kate@katers'
}];

var matches = [{
  creator_id: 1,
  starting_funds: 100000,
  challengee: 1,
  startdate: 'Sat Dec 12 2015 16:55:38 GMT-0800 (PST)',
  enddate: 'Fri Jan 29 2016 00:00:00 GMT-0800 (PST)',
  status: 'in progress',
  type: 'TEST'
}];

var stock = {
  name: 'Facebook, Inc.',
  symbol: 'FB',
  industry: 'Computer Software: Programming, Data Processing',
  sector: 'Technology',
  exchange: 'NASDAQ'
};


 describe('/trades/:matchid/:userid', function () {
  // ============= Setup ============= \\
  // before(function (done) {
  //   //insert users into DB
  //   knex = knex(config['development']);

  //     knex('users').insert(users)
  //     .then(function (user) {
  //       return knex('matches').insert(matches);
  //     })
  //     .then(function () {
  //       done();
  //     });
    

  // });

  // ============= Teardown ============= \\
  // after(function (done) {
  //   //remove trades
  //   Promise.all([
  //       Promise.map(users, function (user) {
  //         return knex('users').where(user).del();
  //       }),
  //       Promise.map(matches, function (match) {
  //         return knex('matches').where(match).del();
  //       })
  //     ])
  //     .then(function () {
  //       done();
  //   });

  // });

  // ============= Tests ============= \\

    describe('POST', function () {
      var matchid = 1;
      var userid = 1;

      xit('buy responds with a 200 (OK)', function (done) {
        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'buy', stockTicker: 'GOOG' })
          .expect(200, done);
      });

      it('responds with the buy trade', function (done) {
        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'buy', stockTicker: 'GOOG' })
          .expect(function (response) {
            var buy = response.body;
            expect(buy).to.be.a('object');
            expect(buy.data.price).to.be.a('number');
          })
          .expect(200, done);
      });

      xit('sell responds with a 200 (OK)', function (done) {
        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'sell', stockTicker: 'GOOG' })
          .expect(200, done);
      });

      it('responds with the sell trade', function (done) {
        request(app)
          .post('/trades/' + matchid + '/' + userid)
          .send({ numShares: 5, action: 'sell', stockTicker: 'GOOG' })
          .expect(function (response) {
            var sell = response.body;
            expect(sell).to.be.a('object');
            expect(sell.data.price).to.be.a('number');
          })
          .expect(200, done);
      });

    });


});