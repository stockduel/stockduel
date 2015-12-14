module.exports = function (knex) {

  var module = {};
  //-------------------------select all user details-------------------------------//

  module.getUsers = function () {
    return knex.select().table('users')
      .catch(function (err) {
        return null;
      });
  };

  //-----------------------get a specific users details---------------------------------//

  module.getUser = function (userID) {
    return knex.select().table('users').where('u_id', '=', userID)
      .then(function (user) {
        return user[0];
      })
      .catch(function (err) {
        return null;
      });
  };

  //-----------------------creates/check a users details----------------------------------//

  module.findOrCreateUser = function (username, password, name, email) {

    return knex.select()
      .table('users')
      .where('email', '=', email)
      .then(function (user) {
        //if the user is already in the table then return the user
        if (user.length > 0) {
          return user;
        }
        //insert the user into the table
        return knex.insert({
          'username': username,
          'password': password,
          'name': name,
          'email': email
        }, '*').into('users');
      })
      .then(function (user) {
        return user[0];
      });
  };

  //-----------------------------------------------------------//

  return module;

};
