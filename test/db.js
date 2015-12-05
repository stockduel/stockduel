var knex = require('../server/db/index.js');
var assert = require('chai').assert;


describe('should connect to db ', function () {
  it('should post info to tables', function () {
    knex('users').insert({'username': 'test', 'password': 'password1234', 'email': 'a@a.com', 'name': 'sir test'}).then(function(){
      knex.select().from('users').where('username', 'test').then(function(data){
        assert.equal(data[0].username, 'test');
      })
    })
  });
});
