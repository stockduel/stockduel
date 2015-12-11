var methods = {};

module.exports = function(knex) {

  methods.insertStock = function(name, symbol, industry, sector, exchange) {

    return knex.insert([{
      name: 'Google',
      symbol: 'GOOG',
      industry: 'Software',
      sector: 'Tech',
      exchange: 'exchange'
    }],'*').into('stocks')
    .then(function (stock) {
      console.log('STOCK INSERT', stock);
      return stock;
    });

  };

  return methods;

};



