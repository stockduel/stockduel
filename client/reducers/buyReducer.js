import {List, Map, toJS} from 'immutable';


export default function buyReducer(state, action) {
  var targetMatch;
  var targetMatchIndex;
  state.get('matches').forEach(function(match, index) {
    if (match.get('m_id') === action.matchID) {
      targetMatch = match;
      targetMatchIndex = index;
    }
  });

  //check to see if trade is valid (aka portfolio has enough cash on hand)
  if ( action.price * action.shares > Number(targetMatch.getIn( ['portfolio', 'available_cash'] )) ) {
    return state;
    //get some sort of error message to the user; may not happen here, but needs to happen somewhere
  }

  //reduce cash on hand 
  var matchWithUpdatedCash = targetMatch.updateIn(['portfolio','available_cash'], cash => {
    return String(+cash - (action.price * action.shares) );
  });

  //add stock (w/shares) to portfolio.stocks array
  var targetStockIndex;
  var targetStock;
  matchWithUpdatedCash.getIn(['portfolio', 'stocks']).forEach(function(stock, index) {
    if(stock.get('stockSymbol') === action.stockSymbol ) {
      targetStock = stock;
      targetStockIndex = index;
    }
  })

  var newStocksArray;

  if ( targetStock ) {  // user already holds the stock being bought
    newStocksArray = matchWithUpdatedCash.getIn(['portfolio', 'stocks']).map(function(stock, index) {
      if( index === targetStockIndex ) {
        return targetStock.update('shares', shares => String(Number(shares) + Number(action.shares)));
      }
      return stock;
    });
  } else { //user doesn't hold the stock being purchased
    // build our new stock map
    var newStockMap = Map({stockSymbol: action.stockSymbol, shares: action.shares, price: action.price})
    // get the stock list that already exists
    var oldStockList = matchWithUpdatedCash.getIn(['portfolio', 'stocks']);

    // set newStocksArray to the list plus newStockMap
    newStocksArray = oldStockList.push(newStockMap);

  }
    // get new version of state by rolling in newStocksArray
    var matchWithUpdatedCashAndStocks = matchWithUpdatedCash.setIn(['portfolio', 'stocks'], newStocksArray);

  var newMatchArray = state.get('matches').map(function(match, index) {
    if( index === targetMatchIndex ) {
      return matchWithUpdatedCashAndStocks;
    }
    return match;
  });
  var newState = state.set('matches', newMatchArray);
  return newState;

}
