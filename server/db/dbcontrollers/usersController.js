module.exports = function (knex) {

  var module = {};

//Select all User Details
//---------------------------
  module.getUsers = function () {
    return knex.select().table('users')
      .catch(function (err) {
        return null;
      });
  };

//Get a Specific Users Details
//------------------------------

  module.getUser = function (userId) {
    return knex.select().table('users').where('u_id', '=', userId)
      .then(function (response) {
        if (response.length === 0) {
          throw new Error('no user found');
        }
        return response[0];
      })
      .catch(function (err) {
        return null;
      });
  };

//Search Users for anything to match input
//-----------------------------------------
  module.searchUsers = function (search) {
    var searchLike = search + '%';
    return knex('users')
      .where(knex.raw('UPPER(username) like UPPER(?)', [searchLike]))
      .orWhere(knex.raw('UPPER(name) like UPPER(?)', [searchLike]));
  };

//Creates/Check a Users Details used from facebook auth route
//---------------------------------------------------------------
  module.findOrCreateUser = function (username, name, email) {

    return knex.select()
      .table('users')
      .where('email', '=', email)
      .then(function (user) {
        //if the user is already in the table then return the user
        if (user.length > 0) {
          return user;
        }
        return knex.insert({
          'username': username,
          'name': name,
          'email': email
        }, '*').into('users');
      })
      .then(function (user) {
        return user[0];
      });
  };

  return module;

};