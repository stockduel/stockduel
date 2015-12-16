var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var knex = require('../index');

var usersController = require('../dbcontrollers/usersController')(knex);

var users = [{
  username: 'TESTannaUser',
  password: 'TESTannaPassword',
  name: 'TESTanna',
  email: 'TESTanna@anna'
}, {
  username: 'TESTkateUser',
  password: 'TESTkatePassword',
  name: 'TESTkate',
  email: 'TESTkate@kate'
}];


// ============= Tests ============= \\
describe('Users Controller', function () {
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
        done();
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  describe('findOrCreateUser', function () {

    it('should insert a user into the users table', function (done) {

      var user = users[0];
      usersController.findOrCreateUser(user.username, user.password, user.name, user.email)
        .then(function (user) {
          expect(user.name).to.equal('TESTanna');
          done();
        });

    });

    it('should not insert the same user into the database multiple times', function (done) {

      var user = users[0];
      usersController.findOrCreateUser(user.username, user.password, user.name, user.email)
        .then(function () {
          return knex('users').where('email', user.email);
        })
        .then(function (response) {
          expect(response.length).to.equal(1);
          done();
        });
    });

  });

  describe('getUser', function () {

    it('should be able to return a specific user', function (done) {
      var user = users[1];
      usersController.findOrCreateUser(user.username, user.password, user.name, user.email)
        .then(function (insertedUser) {
          return insertedUser.u_id;
        })
        .then(function (id) {
          return usersController.getUser(id);
        })
        .then(function (foundUser) {
          expect(foundUser.name).to.equal(user.name);
          done();
        });

    });

  });


  describe('searchUsers', function () {

    it('should find a user by searching by username', function (done) {
      usersController.searchUsers('TESTannaUser')
        .then(function (response) {
          expect(response[0].name).to.equal(users[0].name);
          done();
        });
    });

    it('should find a user by searching by name', function (done) {
      usersController.searchUsers('TESTanna')
        .then(function (response) {
          expect(response[0].name).to.equal(users[0].name);
          done();
        });
    });

    it('should find a user regardless of case', function (done) {
      Promise.all([
          usersController.searchUsers('TESTANnAUsEr')
          .then(function (response) {
            expect(response[0].name).to.equal(users[0].name);
          }),
          usersController.searchUsers('TESTaNNa')
          .then(function (response) {
            expect(response[0].name).to.equal(users[0].name);
          })
        ])
        .then(function () {
          done();
        });
    });

    it('should find all users that match the search query', function (done) {
      usersController.searchUsers('TeSt')
        .then(function (response) {
          expect(response[0].name).to.equal(users[0].name);
          expect(response[1].name).to.equal(users[1].name);
          expect(response.length).to.equal(users.length);
        })
        .then(function () {
          done();
        });
    });

  });

});
