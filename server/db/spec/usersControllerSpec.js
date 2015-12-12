var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var usersController = require('../dbcontrollers/usersController')(knex);

var users = [{
  username: 'annaUser',
  password: 'annaPassword',
  name: 'anna',
  email: 'anna@anna'
}, {
  username: 'kateUser',
  password: 'katePassword',
  name: 'kate',
  email: 'kate@kate'
}];

// ============= Setup ============= \\
before(function (done) {
  done();
});

// ============= Teardown ============= \\
after(function (done) {
  Promise.map(users, function (user) {
      return knex('users').where('email', user.email).del();
    })
    .then(function () {
      console.log('deleted');
      done();
    })
    .catch(function (err) {
      console.log(err);
    });
});

// ============= Tests ============= \\
describe('Users Controller', function () {

  it('should insert a user into the users table', function (done) {

    var user = users[0];
    usersController.createUser(user.username, user.password, user.name, user.email)
      .then(function (user) {
        expect(user.name).to.equal('anna');
        done();
      });

  });

  it('should not insert the same user into the database multiple times', function (done) {

    usersController.createUser('annaUser', 'annaPassword', 'anna', 'anna@anna')
      .catch(function (err) {
        expect(err.message).to.equal('user exists!');
        done();
      });
  });

  it('should be able to return a specific user', function (done) {
    var user = users[1];
    usersController.createUser(user.username, user.password, user.name, user.email)
      .then(function (user) {
        return user.u_id;
      })
      .then(function (id) {
        return usersController.getUser(id);
      })
      .then(function (user) {
        expect(user.name).to.equal('kate');
        done();
      });

  });

  //TODO: This doesn't seem necessary
  xit('return all users from the users table', function (done) {
    return usersController.getUsers()
      .then(function (users) {
        expect(users.length).to.equal(2);
        done();
      });

  });
});
