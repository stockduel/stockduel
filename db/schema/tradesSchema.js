module.exports = function (knex) {
  knex.schema.createTableIfNotExists('trades', function(table){
    table.increments('id').primary();
    table.integer('user_id')
       .references('u_id')
       .inTable('users');
    table.integer('match_id')
       .references('m_id')
       .inTable('matches');
   table.integer('stock_id')
      .references('s_id')
      .inTable('stocks');
    table.integer('shares');
    table.string('action');
    table.timestamps();
    table.float('price');
  }).catch(function(e){console.log(e)});    
};  