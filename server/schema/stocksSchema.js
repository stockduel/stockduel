module.exports = function(knex) {
  return knex.schema.createTable('stocks', function(table){
    table.increments('s_id').primary();
    table.string('name');
    table.string('symbol');
    table.string('industry');
    table.string('sector');
    table.string('exchange');
  });
};