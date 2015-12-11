var knex = require('../index');

Promise.all([
    knex.schema.dropTable('stock_prices'),
    knex.schema.dropTable('stock_prices_archive'),
    knex.schema.dropTable('stocks')
  ])
  .then(function () {
    console.log('Dropped Tables');
    knex.destroy();
  })
  .catch(function (err) {
    console.log(err);
    knex.destroy();
  });
