module.exports = function(knex) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments('u_id').primary();
    table.string('username');
    table.string('password');
    table.string('name');
    table.string('email');
    table.timestamps();
  }).catch(function(e){console.log(e)});
};