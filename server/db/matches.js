//matched controllers

// var Classes = require('./../../classes');

var methods = {};

module.exports = function(knex) {

  methods.getStocks = function(matchId, userId) {

    //join the trades, stocks and stockPrices tables three way join
    //select * from trades 
    //inner join stocks on trades.stock_id = stocks.s_id 
    //inner join stock_prices on stocks.s_id = stock_prices.stockprice_id;

    return knex.from('trades')
      .innerJoin('stocks', 'trades.stock_id', 'stocks.s_id')
      .innerJoin('stock_prices', 'stocks.s_id', 'stock_prices.stockprice_id')
      //??
      .where('userId','=','trades.u_id')
      .andWhere('matchId','=','trades.match_id')
    .then(function (data) {
      console.log(data);
    });


  };

  methods.getMatch = function() {

    // return knex.

  };

  return methods;

};
