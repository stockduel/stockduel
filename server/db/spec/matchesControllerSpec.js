var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var knex = require('./../index.js').knex;

//tests for all tables but the pre-populated stock tables. Two commented out, 
//that might be useful to get working to test validation errors- need to change throwwing of errors in the trades.js controller

var db = require('./../index.js');

describe('controllers', function() {

  //first two only true on first run of the tests
  xit('should insert user details into the users table', function() {

    return db.methods.users.createUser('annaUser', 'annaPassword', 'anna', 'anna@anna')
    .then(function (user) {
        expect(user[0].name).to.equal('anna');
    });
  
  });

  xit('should insert a second user', function() {

    return db.methods.users.createUser('kateUser', 'katePassword', 'kate', 'kate@kate')
    .then(function (user) {
        expect(user[0].name).to.equal('kate');
    });
  
  });

  it('should not insert the same user into the database multiple times', function() {

    return db.methods.users.createUser('annaUser', 'annaPassword', 'anna', 'anna@anna')
    .then(function (user) {
      expect(user).to.be.undefined;
    });
  
  });

  it('should be able to return a specific user', function() {

    return db.methods.users.getUser(2)
    .then(function (user) {
      expect(user[0].name).to.equal('kate');
    });
  
  });

  it('return all users details from the users table', function() {
    return db.methods.users.getUsers()
    .then(function (data) {
      expect(data[0].name).to.equal('anna');
    });
  
  });

  it('should insert a match into the matches table', function() {
    return db.methods.matches.createMatch('1', '100000', 'solo')
    .then(function(data) {
      expect(data[0].type).to.equal('solo');
      expect(data[0].creator_id).to.equal(1);
    });
  });

  it('should get a specific match from the matches table', function() {
    //when getting matches in test mode need to check that primary id is starting at one -- ask Anna
    return db.methods.matches.getMatch(1)
    .then(function(data) {
      expect(data[0].challengee).to.equal(1);
    });
  });

  it('should insert a buy into the trades table', function () {
    return db.methods.trades.buy(1,1,12,'buy','TFSC')
    .then(function (data) {
      expect(data[0].shares).to.equal(12);
    });
  });


  //How to check a thrown error??-------------------------------------//---------would be good to get some sort of test for this post MVP? but working manually
    // it('should reject a buy that the user cant afford', function () {
    //   return db.methods.trades.buy(1,1,200000,'buy','TFSC')
    //   .then(function (data) {
    //     console.log('Should not be logged!',data);
    //   })
    //  .catch(function (err) {
    //    console.log(err);
    //  });
    // });

  it('should insert a sell into the trades table', function () {
    return db.methods.trades.sell(1,1,2,'sell', 'TFSC')
    .then(function (data) {
      expect(data[0].shares).to.equal(2);
    });
  });

  //How to check a thrown error??---------------------------------------//-------would be good to get some sort of test for this post MVP? but working manually
    // it('should reject a sell if the user does not have that many stocks to sell', function () {
    //   return db.methods.trades.sell(1,1,5,'sell', 'TFSC')
    //   .then(function (data) {
    //      console.log('Should not be logged!',data);
    //   })
    //  .catch(function (err) {
    //    console.log('Error in processing a sell',err);
    //  });
    // });

  xit('should get a user portfolio', function () {
    return db.methods.trades.getTrades(1,1) //take user and match id
    .then(function (data) {
      // expect(data[0].symbol).to.equal('TFSC'); //change when know one
      console.log('DATA', data);
      expect(data[0].name).to.equal('1347 Capital Corp.');
      expect(data[0].action).to.equal('sell');
    });
  });

  // xit('should insert a trade into the stocks table', function () {

  //   return db.methods.stocks.insertStock('Google', 'GOOG', 'Software', 'Tech', 'Exchange')
  //   .then(function (data) {
  //     expect(data[0].name).to.equal('Google');
  //   });

  // });

  //NEED A WAY TO EMPTY THE TABLES AFTER THE TESTS HAVE BEEN RUN

});


