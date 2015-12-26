var Promise = require('bluebird');
var stocksController = require('./stocksController');

module.exports = function (knex) {
  'use strict';
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

  module.getTrades = function (userID, matchID) {
    return knex.select()
      .table('trades')
      .where('user_id', '=', userID)
      .andWhere('match_id', '=', matchID)
      .orderBy('created_at', 'desc');
  };

  module.buy = function (userID, matchID, numShares, stockTicker) {

    var trade;

    return Promise.all([
        stocksCtrl.getStock(stockTicker),
        generatePortfolio(userID, matchID)
      ])
      .then(function (tuple) {
        var stock = tuple[0];
        var portfolio = tuple[1];

        var available_cash = portfolio.available_cash;

        if (stock === null) {
          throw new Error('stock symbol does not exist');
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
      .then(function(resp){

        trade = resp;
        return module.getPortfolio(userID, matchID);

      })
      .then(function(port){

        return {
          trade: trade,
          portfolio: port
        };

      })
      .catch(function (err) {
        console.log(err);
        return null;
      });
  };

  module.sell = function (userID, matchID, numShares, stockTicker) {

    var trade;

    return Promise.all([
        stocksCtrl.getStock(stockTicker),
        generatePortfolio(userID, matchID)
      ])
      .then(function (tuple) {
        var stock = tuple[0];
        var portfolio = tuple[1];
        var stocks = portfolio.stocks;
        var available_cash = portfolio.available_cash;

        if (stock === null) {
          throw new Error('stock symbol does not exist');
        }

        if (stocks[stock.symbol] === undefined ||
          stocks[stock.symbol].shares < numShares) {
          throw new Error('number of shares to sell exceeds number of shares owned');
        }

        available_cash += stock.bid * numShares;

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
      .then(function(resp){

        trade = resp;
        return module.getPortfolio(userID, matchID);

      })
      .then(function(port){

        return {
          trade: trade,
          portfolio: port
        };

      })
      .catch(function (err) {
        return null;
      });
  };

  var getAllTradesWithStockData = function (userID, matchID) {
    return knex('trades').where({
        user_id: userID,
        match_id: matchID
      })
      .join('stock_prices', 'trades.symbol', '=', 'stock_prices.symbol')
      .join('stocks', 'trades.symbol', '=', 'stocks.symbol')
      .orderBy('created_at', 'ASC');
  };

  var costAverage = function (currentPrice, currentShares, newPrice, newShares) {
    var cost = (currentPrice * currentShares + newPrice * newShares) / (currentShares + newShares);
    return Number(cost.toFixed(2));
  };

  module.reduceTradesToPortfolio = function (trades, startingFunds) {
    var availableCash = startingFunds;

    var stocks = trades.reduce(function (portfolio, trade) {

      var stock = portfolio[trade.symbol];

      if (stock === undefined) {
        portfolio[trade.symbol] = {};
        stock = portfolio[trade.symbol];
        stock.symbol = trade.symbol;
        stock.shares = 0;
        stock.price = 0;
        stock.bid = trade.bid;
        stock.ask = trade.ask;
        stock.name = trade.name;
        stock.percent_change = trade.percent_change;

      }

      if (trade.action === BUY) {
        availableCash -= (trade.price * trade.shares);
        stock.price = costAverage(stock.price, stock.shares, trade.price, trade.shares);
        stock.shares += trade.shares;
      } else if (trade.action === SELL) {
        availableCash += (trade.price * trade.shares);
        stock.price = costAverage(stock.price, stock.shares, trade.price, trade.shares);
        stock.shares -= trade.shares;
      } else {
        throw new Error('unsupported action type. expected buy or sell');
      }

      // remove stocks with 0 shares after selling
      if (stock.shares === 0) {
        delete portfolio[trade.symbol];
      }

      return portfolio;
    }, {});

    return {
      available_cash: availableCash,
      stocks: stocks
    };

  };

  var generatePortfolioMetrics = function (portfolio) {
    var portfolioValue = 0;
    var availableCash = portfolio.available_cash;

    var stocks = Object.keys(portfolio.stocks).map(function (stockSymbol) {
      var stockData = portfolio.stocks[stockSymbol];
      stockData.marketValue = Number((stockData.bid * stockData.shares).toFixed(2));
      portfolioValue += stockData.marketValue;
      stockData.gain_loss = Number((stockData.marketValue - stockData.price * stockData.shares).toFixed(2));
      return stockData;
    });

    return {
      totalValue: portfolioValue + availableCash,
      available_cash: availableCash,
      stocks: stocks
    };

  };

  module.getPortfolio = function (userID, matchID) {
    return generatePortfolio(userID, matchID)
      .then(generatePortfolioMetrics);
  };

  var getMatch = function (matchID) {
    return knex.select()
      .table('matches').where('m_id', '=', matchID)
      .then(function (match) {
        return match[0];
      });
  };

  var generatePortfolio = function (userID, matchID) {

    return Promise.all([
        getMatch(matchID),
        getAllTradesWithStockData(userID, matchID)
      ])
      .then(function (tuple) {
        var match = tuple[0];
        var trades = tuple[1];
        return module.reduceTradesToPortfolio(trades, match.starting_funds);
      })
      .catch(function (err) {
        console.error(err);
        return null;
      });
  };

  return module;
};
