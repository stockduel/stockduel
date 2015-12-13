module.exports = function (knex) {
  var module = {};

  module.getStock = function (symbol) {
    return knex('stocks')
      .join('stock_prices', 'stocks.symbol', '=', 'stock_prices.symbol')
      .where(knex.raw('stocks.symbol = UPPER(?)', [symbol]))
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
    return knex('stocks')
      .where(knex.raw('symbol like UPPER(?)', [searchLike]))
      .orWhere(knex.raw('UPPER(name) like UPPER(?)', [searchLike]));
  };

  //pass in array of objects contaning symbol,shares,and price 
  //query stock_prices and update price if needed and return
  module.getPrices = function (stockArr) {
    
    return knex.select('symbol','ask')
      .from('stock_prices')
    .then(function (dataArr) {

      return stockArr.map(function (stockObj) {
        var price;
        for (var i = 0; i < dataArr.length; i++) {
          if (dataArr[i].symbol === stockObj.stockSymbol) {
            if (dataArr[i].ask !== stockObj.price) {
              stockObj.price = dataArr[i].ask;
            }
          }
        }
        return stockObj;
      });

    });

  };

  //pass in array of objects contaning symbol,shares,and price 
  //query stock_prices and update price if needed and return
  module.getPrices = function (stockArr) {
    
    return knex.select('symbol','ask')
      .from('stock_prices')
    .then(function (dataArr) {

      return stockArr.map(function (stockObj) {
        var price;
        for (var i = 0; i < dataArr.length; i++) {
          if (dataArr[i].symbol === stockObj.stockSymbol) {
            if (dataArr[i].ask !== stockObj.price) {
              stockObj.price = dataArr[i].ask;
            }
          }
        }
        return stockObj;
      });

    });

  };


  return module;

};
