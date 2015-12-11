var methods = {};

module.exports = function(knex) {

  //think about using a Knex transactions to lock down the price while query happening post MVP thing
  //think about checking that they have less than or equal to 25 stocks post MVP

  //-------------------------------------buy a stock controller -----------------------------------------//
  methods.buy = function (userID, matchID, numShares, action, stockTicker) {
    var stockID;
    var total;
    var cashRemaining;
    var cashToDate;
    var price;
      
    //get the stock id
    return knex.select().from('stocks').where('symbol','=', stockTicker)
    .then(function(stock) {
      stockID = stock[0].s_id;
      return knex.select('ask').from('stock_prices').where('symbol', '=', stockTicker);
    })
    .then(function(ask) {
      price = ask[0].ask;
      total = price * numShares;
      //find the lastest trade from that user in that match
      return knex.select()
      .table('trades')
      .where('user_id','=', userID)
      .andWhere('match_id','=', matchID)
      .orderBy('created_at','desc')
      .limit(1);

    })
    .then(function (lastTrade) {
      //calculate available funds
      if (lastTrade.length === 0) {
        cashToDate = '100000';
        cashRemaining = cashToDate - total;
      } else {
        cashToDate = lastTrade[0].cash_in_hand;
        cashRemaining = lastTrade[0].cash_in_hand - total;
      }
      //check have enough to buy
      if (cashRemaining < 0) {
        throw new Error('Not a valid trade: you have $'+lastTrade[0].cash_in_hand+' cash in hand to spend and are trying to buy $'+total+' of shares');
      }

      //insert to trades
      return knex.insert([{
        user_id: userID,
        match_id: matchID,
        stock_id: stockID,
        shares: numShares,
        action: action,
        price: price,
        cash_in_hand: cashRemaining
      }], '*')
      .into('trades');

    })
    //then insert the correct data
    .then(function (trade) {
      return trade;
    });
  };

  //-------------------------------------sell a stock controller -----------------------------------------//

  methods.sell = function (userID, matchID, numShares, action, stockTicker) {
    //to be done after buy is working
    var stockID;
    var total;
    var cashRemaining;
    var cashToDate;
    var price;
      
    //get stock id
    return knex.select().from('stocks').where('symbol','=', stockTicker)
    .then(function(stock) {
      stockID = stock[0].s_id;
      return knex.select('ask').from('stock_prices').where('symbol', '=', stockTicker);
    })
    .then(function(ask) {
      price = ask[0].ask;
      total = price * numShares;
      //find the lastest trade from that user in that match
      return knex.select()
      .table('trades')
      .where('user_id','=', userID)
      .andWhere('match_id','=', matchID)
      .orderBy('created_at','desc')
      .limit(1);

    })
    .then(function (lastTrade) {
      //get the matchID
      //sum all of the users shares for the match
      if (lastTrade.length === 0) {
        throw new Error('You have no '+stockTicker+' stocks to sell');
      }
      
      cashRemaining = lastTrade[0].cash_in_hand;

      return knex('trades')
      .sum('shares')
      .where('stock_id','=', stockID)
      .where('match_id','=', matchID)
      .andWhere('user_id','=', userID);

    })
    .then(function (sharesSum) {
      //calculate available funds
      if (sharesSum[0].sum === null) {
        currShares = 0;
      } else {
        currShares = sharesSum[0].sum;
      }
      //check have enough to buy
      if (currShares < numShares) {
        throw new Error('Not a  valid trade: you only have '+currShares+' shares of '+stockTicker+' to sell');
      }

      cashRemaining = cashRemaining + total;

      //insert to trades
      return knex.insert([{
        user_id: userID,
        match_id: matchID,
        stock_id: stockID,
        shares: numShares,
        action: action,
        price: price,
        cash_in_hand: cashRemaining
      }], '*')
      .into('trades');

    })
    //then insert the correct data
    .then(function (trade) {
      return trade;
    });
  };

  //---------------------get user portfolio------------------------------------//

  methods.getTrades = function(userID, matchID) {
    //join the stock table with the trades and stockprices
    return knex('stocks')
    .join('trades', 'stocks.s_id', '=', 'trades.stock_id')
    .join('stock_prices', 'stocks.symbol', '=', 'stock_prices.symbol')
    .then(function (data) {
      var portfolio = data.filter(function (trade) {
        if (trade.match_id === parseInt(matchID,10) && trade.user_id === parseInt(userID,10)) {
            return trade;
        }
      });
      return portfolio;
    })
    .catch(function (err) {
      console.log('Error getting portfolio');
      return err;
    });

  };

  //----------------------------------------------------------//

  return methods;

};






