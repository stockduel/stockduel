module.exports = function (knex) {
  return knex.schema.createTableIfNotExists('stocks', function (table) {
    table.increments('s_id').primary();
    table.string('name');
    table.string('symbol')
      .unique();
    table.string('industry');
    table.string('sector');
    table.string('exchange');
  });
};
