var Promise = require('bluebird');
var stocksController = require('./stocksController');

module.exports = function (knex) {
  'use strict';
  var stocksCtrl = stocksController(knex);

  var module = {};

  var BUY = 'buy';
  var SELL = 'sell';

//Create Trade: insert a trade into the trades table
//------------------------------------------------------
  var createTrade = function (trade) {
    return knex.insert(trade, '*').into('trades')
      .then(function (response) {
        return response[0];
      });
  };

//Get a specific trade. userId {string} matchId {string}
//-------------------------------------------------------
  module.getTrades = function (userId, matchId) {
    return knex.select()
      .table('trades')
      .where('user_id', '=', userId)
      .andWhere('match_id', '=', matchId)
      .orderBy('created_at', 'desc');
  };

//Buy Controller. userId {string} matchId {string} numShares {int} stockTicker {stockTicker}
//--------------------------------------------------------------------------------------------
  module.buy = function (userId, matchId, numShares, stockTicker) {

    var trade;

    return Promise.all([
        //get the details of the stock you want to buy and gets the users portfolio
        stocksCtrl.getStock(stockTicker),
        generatePortfolio(userId, matchId)
      ])
      //takes results and checks user authorised to buy specified stock/stock symbol is valid
      //if all is allowed then new buy is inserted into the trades table with the available_funds updated
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
          user_id: userId,
          match_id: matchId,
          symbol: stockTicker,
          shares: numShares,
          action: BUY,
          price: stock.ask,
          available_cash: available_cash
        });
      })
      .then(function(resp){
        //the trade that just occured is stored and the newly updated portfolio is got again from the database
        trade = resp;
        return module.getPortfolio(userId, matchId);
      })
      .then(function(port){
        //return both the trade that occured and the new portfolio
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

//Buy Controller. userId {string} matchId {string} numShares {int} stockTicker {stockTicker}
//--------------------------------------------------------------------------------------------
  module.sell = function (userId, matchId, numShares, stockTicker) {

    var trade;

    return Promise.all([
        //get information for a specific stock and the users portfolio for the match
        stocksCtrl.getStock(stockTicker),
        generatePortfolio(userId, matchId)
      ])
      //take the return data and check that the trade is valid/stock exists
      //if all fine the avaiable cash updated and data is inserted
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
          user_id: userId,
          match_id: matchId,
          symbol: stockTicker,
          shares: numShares,
          action: SELL,
          price: stock.bid,
          available_cash: available_cash
        });
      })
      .then(function(resp){
        //the trade is returned after it has been inserted
        //and the newly updated portfolio is generated
        trade = resp;
        return module.getPortfolio(userId, matchId);
      })
      .then(function(port){
        //trade and portfolio sent back to the user
        return {
          trade: trade,
          portfolio: port
        };
      })
      .catch(function (err) {
        return null;
      });
  };

//Get specific match and all trades with the corresponding stock data
  var getAllTradesWithStockData = function (userId, matchId) {
    return knex('trades').where({
        user_id: userId,
        match_id: matchId
      })
      .join('stock_prices', 'trades.symbol', '=', 'stock_prices.symbol')
      .join('stocks', 'trades.symbol', '=', 'stocks.symbol')
      .orderBy('created_at', 'ASC');
  };

//Cost Average for calculating the stock price in reduceTradesToPortfolio 
  var costAverage = function (currentPrice, currentShares, newPrice, newShares) {
    var cost = (currentPrice * currentShares + newPrice * newShares) / (currentShares + newShares);
    return Number(cost.toFixed(2));
  };

//Rolls up the users trades for a specific match into a portfolio
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

//Gets/calculates the various number related fields of the stock
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

//Function that calls generatePortfolio and then the generatePortfolioMetrics function: called by buy and sell to compile a users portfolio
  module.getPortfolio = function (userId, matchId) {
    return generatePortfolio(userId, matchId)
      .then(generatePortfolioMetrics);
  };

//Get a Specific Match from the Matches Table
  var getMatch = function (matchId) {
    return knex.select()
      .table('matches').where('m_id', '=', matchId)
      .then(function (match) {
        return match[0];
      });
  };

//Generate the Users Portfolio
  var generatePortfolio = function (userId, matchId) {

    return Promise.all([
        //get specific match and all trades with the corresponding stock data
        getMatch(matchId),
        getAllTradesWithStockData(userId, matchId)
      ])
      //pass the results from above to the reduceTradesToPortfolio which returns a users portfolio for the match in
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
