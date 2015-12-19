var Promise = require('bluebird');
var stocksController = require('./stocksController');

module.exports = function (knex) {
  'use strict';
  var STARTING_CASH = 100000;
  var stocksCtrl = stocksController(knex);

  var module = {};

  var BUY = 'buy';
  var SELL = 'sell';

  var createTrade = function (trade) {
    return knex.insert(trade, '*').into('trades')
      .then(function (response) {
        return response[0];
      });
  };

  module.currentStocks = function (trades) {
    return trades.reduce(function (portfolio, trade) {

      var action = trade.action;
      var symbol = trade.symbol;
      var shares = trade.shares;

      if (portfolio[symbol] === undefined) {
        portfolio[symbol] = 0;
      }

      if (action === BUY) {
        portfolio[symbol] += shares;
      } else if (action === SELL) {
        portfolio[symbol] -= shares;
      }

      if (portfolio[symbol] === 0) {
        delete portfolio[symbol];
      }

      return portfolio;
    }, {});
  };

  module.getTrades = function (userID, matchID) {
    return knex.select()
      .table('trades')
      .where('user_id', '=', userID)
      .andWhere('match_id', '=', matchID)
      .orderBy('created_at', 'desc');
  };

  module.buy = function (userID, matchID, numShares, stockTicker) {

    return Promise.all([
        stocksCtrl.getStock(stockTicker),
        module.getTrades(userID, matchID)
      ])
      .then(function (tuple) {
        var stock = tuple[0];
        var trades = tuple[1];
        var available_cash = STARTING_CASH;

        if (stock === null) {
          throw new Error('stock symbol does not exist');
        }

        if (trades.length > 0) {
          available_cash = trades[0].available_cash;
        }

        if (stock.ask * numShares > available_cash) {
          throw new Error('insufficent funds');
        }

        available_cash -= stock.ask * numShares;

        return createTrade({
          user_id: userID,
          match_id: matchID,
          symbol: stockTicker,
          shares: numShares,
          action: BUY,
          price: stock.ask,
          available_cash: available_cash
        });
      })
      .catch(function (err) {
        return null;
      });
  };

  //-------------------------------------sell a stock controller -----------------------------------------//

  module.sell = function (userID, matchID, numShares, stockTicker) {

    return Promise.all([
        stocksCtrl.getStock(stockTicker),
        module.getTrades(userID, matchID)
      ])
      .then(function (tuple) {
        var stock = tuple[0];
        var trades = tuple[1];
        var portfolio = module.currentStocks(trades);

        if (stock === null) {
          throw new Error('stock symbol does not exist');
        }

        if (portfolio[stock.symbol] === undefined ||
          portfolio[stock.symbol] < numShares) {
          throw new Error('number of shares to sell exceeds number of shares owned');
        }

        var available_cash = trades[0].available_cash + (stock.bid * numShares);
        return createTrade({
          user_id: userID,
          match_id: matchID,
          symbol: stockTicker,
          shares: numShares,
          action: SELL,
          price: stock.bid,
          available_cash: available_cash
        });
      })
      .catch(function (err) {
        return null;
      });
  };

  //---------------------get user portfolio------------------------------------//

  module.getPortfolio = function (userID, matchID) {

    return knex('trades').where({
        user_id: userID,
        match_id: matchID
      })
      .join('stock_prices', 'trades.symbol', '=', 'stock_prices.symbol')
      .join('stocks', 'trades.symbol', '=', 'stocks.symbol')
      .orderBy('created_at', 'ASC')
      .then(function (trades) {
        var portfolio = trades.reduce(function (portfolio, trade) {
          var stockSymbol = trade.symbol;
          if (portfolio[stockSymbol] === undefined) {
            portfolio[stockSymbol] = {
              stockSymbol: stockSymbol,
              name: trade.name,
              shares: 0,
              price: 0,
              percent_change: trade.percent_change,
              bid: trade.bid,
              ask: trade.ask
            };
          }

          if (trade.action === BUY) {
            portfolio[stockSymbol].price = (portfolio[stockSymbol].price * portfolio[stockSymbol].shares + trade.price * trade.shares) / (portfolio[stockSymbol].shares + trade.shares);
            portfolio[stockSymbol].shares += trade.shares;
          } else if (trade.action === SELL) {
            portfolio[stockSymbol].shares -= trade.shares;
          }

          if (portfolio[stockSymbol].shares === 0) {
            delete portfolio[stockSymbol];
          }

          return portfolio;
        }, {});
        var runningSum = 0;
        var stocks = Object.keys(portfolio).map(function (stock) {
          var stockData = portfolio[stock];
          stockData.marketValue = stockData.bid * stockData.shares;
          runningSum += stockData.marketValue;
          stockData.gain_loss = (stockData.marketValue - stockData.price * stockData.shares).toFixed(2);
          return stockData;
        });

        return {
          portfolio: {
            totalValue: runningSum + trades[trades.length - 1].available_cash,
            available_cash: trades[trades.length - 1].available_cash,
            stocks: stocks
          },
          matchID: matchID
        };
      })
      .catch(function (err) {
        console.error(err);
        return null;
      });

  };

  //----------------------------------------------------------//

  return module;

};
