var methods = {};

module.exports = function(knex) {

  //-------------------------select all user details-------------------------------//

  methods.getUsers = function() {

    return knex.select().table('users')
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      console.log('error in getting user data',err);
    });

  };

  //-----------------------get a specific users details---------------------------------//

  methods.getUser = function(userID) {
    return knex.select().table('users').where('u_id','=', userID)
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      console.log('error in getting user data',err);
    });

  };

  //-----------------------creates/check a users details----------------------------------//

  methods.createUser = function(username, password, name, email) {
    //insert user details into the database
    //check the database for the user

    return knex.select().table('users').where('email','=', email)
    .then(function (user) {
      //if the user is already in the table then return the user
      if (user[0]) {
        return;
      } else {
        //insert the user into the table
        return knex.insert([
          {
          'username': username,
          'password': password,
          'name': name,
          'email': email}], '*')
        .into('users');
      }
    })
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      console.log('error in inserting user data',err);
    });
  
  };

    //-----------------------------------------------------------//

  return methods;

};

