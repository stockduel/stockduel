module.exports = function(knex) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments('u_id').primary();
    table.string('username').unique();
    table.string('password');
    table.string('name');
    table.string('email').unique();
    //table.string('fb_id')
    // table.string('f_name');
    // table.string('l_name');
    // table.string('email').unique();
    //table.string('lastFbUpdate');
    //table.string('fbVerified');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  }).catch(function(e){console.log(e);});
};

