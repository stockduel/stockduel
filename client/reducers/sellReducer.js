import {List, Map, toJS} from 'immutable';


export default function sellReducer(state, action) {
  var targetMatch;
  var targetMatchIndex;
  state.get('matches').forEach(function(match, index) {
    if (match.get('matchId') === action.matchId) {
      targetMatch = match;
      targetMatchIndex = index;
    }
  });

  //check to see if they have enough shares of the stock to sell
  var hasEnoughShares = targetMatch.getIn(['portfolio', 'stocks']).some( (stockObj) => {
    return stockObj.get('stockSymbol') === action.stockSymbol && Number(stockObj.get('shares')) >= Number(action.shares);
  });

  //return state unchanged if the trade is invalid
  if (!hasEnoughShares) {
    return state;
  }

  //add to cash on hand 
  var UpdatedCash = targetMatch.updateIn(['portfolio','availableCash'], cash => {
    return String(+cash + (action.price * Number(action.shares)) );
  });

  // update numShares, remove if shares === 0
  var newStocksArray;
  var finalStocksArray;
  var stockIdxToRemove;

  newStocksArray = UpdatedCash.getIn(['portfolio', 'stocks']).map(function(stock, index) {
      if( stock.get('stockSymbol') === action.stockSymbol ) { // found stock being sold

        if (Number(stock.get('shares')) === Number(Number(action.shares)) ) { // selling all of our shares, return nothing
          stockIdxToRemove = index;
          return;

        } else { // reduce number of shares, keep stock Id in list

          var reducedShares = Map({
            stockSymbol: action.stockSymbol,
            shares: String(Number(stock.get('shares')) - Number(action.shares))
          });
          return reducedShares;
        }
      }
      return stock;
    });
    // modify newStocksArray if there is a stock to remove
    if (stockIdxToRemove !== undefined) {
      finalStocksArray = newStocksArray.remove(stockIdxToRemove);
    } else {
      finalStocksArray = newStocksArray;
    }

    // get new version of state by rolling in newStocksArray
  var UpdatedCashAndStocks = UpdatedCash.setIn(['portfolio', 'stocks'], finalStocksArray);

  var newMatchArray = state.get('matches').map(function(match, index) {
    if( index === targetMatchIndex ) {
      return UpdatedCashAndStocks;
    }
    return match;
  });

  var newState = state.set('matches', newMatchArray);
  return newState;
}
