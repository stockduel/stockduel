import {List, Map, toJS} from 'immutable';

//see buy reducer
//get the state of the current match
//loop down and get the stocks then find correct one to update/add to

export default function addStockReducer(state, action) {
  var targetMatch;
  //find the match you are in
  state.get('matches').forEach(function(match, index) {
    if (match.get('matchID') === action.match_id) {
      targetMatch = match;
      // targetMatchIndex = index; why get this??
    }
  });

  //add stock (w/shares) to portfolio.stocks array
  // var targetStockIndex;
  // var newStocksArray;

  var stocks = targetMatch.getIn(['portfolio', 'stocks']);

  var newStock;
    
  var newStockArray = stocks.map((stock, index) => {

    if(stock.toJS().stockSymbol === action.symbol) {

      var normalObj = stock.toJS();

      normalObj.name = action.name;
      normalObj.ask = action.ask;
      normalObj.bid = action.bid;
      normalObj.percent_change = action.percent_change;
      normalObj.match_id = action.match_id;
      normalObj.days_high = action.days_high;
      normalObj.days_low = action.days_low;

      return newStock = normalObj;

    }

  });
  console.log('COMPLETE MAP', newStockArray);
  var newState = state.set('stocks', newStockArray);

  return newState;

};


