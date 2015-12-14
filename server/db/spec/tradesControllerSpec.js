var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var tradesController = require('../dbcontrollers/tradesController')(knex);
var matchesController = require('../dbcontrollers/matchesController')(knex);

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
  startFunds: 100000,
  type: 'TEST'
}];

var stock = {
  name: 'Facebook, Inc.',
  symbol: 'FB',
  industry: 'Computer Software: Programming, Data Processing',
  sector: 'Technology',
  exchange: 'NASDAQ'
};


describe('Trade Controller', function () {
  // ============= Setup ============= \\
  before(function (done) {
    //insert users into DB
    knex('users').insert(users, '*')
      .then(function (response) {
        users = response;
      })
      //create a match
      .then(function () {
        var user = users[0];
        var match = matches[0];
        return matchesController.createMatch(user.u_id, match.startFunds, match.type);
      })
      .then(function (createdMatch) {
        matches[0].m_id = createdMatch.m_id;
        done();
      });

  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove trades
    knex('trades').where({
        'match_id': matches[0].m_id
      }).del()
      //remove matches
      .then(function () {
        return Promise.map(matches, function (match) {
          return knex('matches').where('m_id', match.m_id).del();
        });
      })
      //remove users
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('users').where('u_id', user.u_id).del();
        });
      })
      .then(function () {
        console.log('deleted');
        done();
      })
      .catch(function (err) {
        console.log(err);
      });

  });

  it('should be able to place a buy trade', function (done) {
    var user = users[0];
    var match = matches[0];
    var trade = {
      action: 'buy',
      shares: 100,
      symbol: stock.symbol
    };

    tradesController.buy(user.u_id, match.m_id, trade.shares, trade.action,trade.symbol)
      .then(function (trade) {
        expect(trade.shares).to.equal(100);
        done();
      });
  });



  // it('should reject a buy that the user cant afford', function () {
  //   return tradesController.buy(1,1,200000,'buy','TFSC')
  //   .then(function (data) {
  //     console.log('Should not be logged!',data);
  //   })
  //  .catch(function (err) {
  //    console.log(err);
  //  });
  // });

  it('should be able to place a sell trade', function (done) {
    var user = users[0];
    var match = matches[0];
    var trade = {
      action: 'sell',
      shares: 90,
      symbol: 'FB'
    };

    tradesController.sell(user.u_id, match.m_id, trade.shares, trade.action, trade.symbol)
      .then(function (trade) {
        expect(trade.shares).to.equal(90);
        done();
      });
  });


  // it('should reject a sell if the user does not have that many stocks to sell', function () {
  //   return tradesController.sell(1,1,5,'sell', 'TFSC')
  //   .then(function (data) {
  //      console.log('Should not be logged!',data);
  //   })
  //  .catch(function (err) {
  //    console.log('Error in processing a sell',err);
  //  });
  // });

  it('should be able to get a user portfolio', function (done) {
    var user = users[0];
    var match = matches[0];

    return tradesController.getTrades(user.u_id, match.m_id)
      .then(function (data) {
        expect(data[0].name).to.equal(stock.name);
        expect(data[0].action).to.equal('sell');
        done();
      });
  });


});
