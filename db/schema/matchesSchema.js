module.exports = function(knex) {
  return knex.schema.createTableIfNotExists('matches', function(table) {
    table.increments('m_id').primary();
    table.integer('creator_id')
        .references('u_id')
        .inTable('users');
    table.float('starting_funds');
    table.integer('challengee')
        .references('u_id')
        .inTable('users');
    //table.dateTime('startdate'); commented out for the time being as not for MVP
    //table.dateTime('enddate');
    //table.string('status');
    table.string('type');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  }).catch(function(e){console.log(e);});
};
