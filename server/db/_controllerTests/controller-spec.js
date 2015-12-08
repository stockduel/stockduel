var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;


var db = require('../index.js'); //knex initiator

describe('controllers', function() {

/*  beforeEach(function() {
    //run before each
  });*/

  it('should be able to get all details for a particlar users match', function() {

    return db.matches.getStocks()
    .then(function(data) {
      expect(data).to.exist;
    });
  
  });

  // it('should be able to get the details of a specific match', function() {

  //   return db.users.create()
  //   .then(function(data) {
  //     expect(data.length).to.equal(1);
  //     expect(data[0].email).to.equal();
  //     rohanId = data[0].id;
  //   });
  
  // });

  // it('should be able to add a message to the messages table', function() {

  //   return db.messages.addMessage('yo world', kateId, rohanId)
  //   .then(function(data) {
  //     expect(data[0].text).to.equal('yo world');
  //     expect(data[0].from).to.equal(kateId);
  //   });

  // });

  // it('should get messages from rohan', function() {

  //    return db.messages.getMessages('sarith21@gmail.com')
  //    .then(function(data) {
  //       expect(data[0].text).to.equal('yo world');
  //       expect(data[0].from).to.equal(1);
  //    });

  // });

});