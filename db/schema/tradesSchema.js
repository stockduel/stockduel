module.exports = function (knex) {
  return knex.schema.createTableIfNotExists('trades', function (table) {
    table.increments('t_id').primary();
    table.integer('user_id')
      .references('u_id')
      .inTable('users');
    table.integer('match_id')
      .references('m_id')
      .inTable('matches');
    table.string('symbol')
      .references('symbol')
      .inTable('stocks');
    table.integer('shares');
    table.string('action');
    table.timestamps();
    table.float('price');
    table.float('available_cash');
  });
};
