module.exports = function(knex) {
  return knex.schema.createTableIfNotExists('matches', function(table) {
    table.increments('m_id').primary();
    table.string('title');
    table.integer('creator_id')
        .references('u_id')
        .inTable('users');
    table.float('starting_funds');
    table.integer('challengee')
        .references('u_id')
        .inTable('users');
    table.dateTime('startdate');
    table.dateTime('enddate');
    table.string('status');
    table.string('type');
  }).catch(function(e){console.log(e);});
};
