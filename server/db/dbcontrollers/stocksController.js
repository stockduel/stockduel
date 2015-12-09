module.exports = function (knex) {
  var module = {};

  module.getStock = function (symbol) {
    return knex('stocks')
      .join('stock_prices', 'stocks.symbol', '=', 'stock_prices.symbol')
      .where('stocks.symbol', symbol)
      .then(function (response) {
        if (response.length !== 1) {
          throw new Error('unexepected response length: ' +
            response.length);
        }
        return response[0];
      })
      .catch(function (err) {
        return null;
      });

  };

  module.searchStock = function (search) {
    var searchLike = search + '%';
    return knex('stocks').where('symbol', 'like', searchLike)
      .orWhere('name', 'like', searchLike);
  };

  return module;
};
