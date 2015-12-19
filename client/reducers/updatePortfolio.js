import {List, Map, toJS, fromJS} from 'immutable';

//see buy reducer
//get the state of the current match
//loop down and get the stocks then find correct one to update/add to

export default function addStockReducer(state, action) {
  //find the match you are in
  var targetMatch;
  var targetMatchIndex;
  state.get('matches').forEach(function(match, index) {
    if (match.get('m_id') === action.matchID) {
      targetMatch = match;
      targetMatchIndex = index;
    }
  });

  var stocks = targetMatch.getIn(['portfolio', 'stocks']);

  var newStock;

  var newStockArray = stocks.map((stock, index) => {

    if(stock.get('stockSymbol') === action.stocks[0].stockSymbol) {

      var normalObj = stock.toJS();

      normalObj.name = action.stocks[0].name;
      normalObj.ask = action.stocks[0].ask;
      normalObj.bid = action.stocks[0].bid;
      normalObj.percent_change = action.stocks[0].percent_change;
      normalObj.marketValue = action.stocks[0].marketValue;
      normalObj.gain_loss = action.stocks[0].gain_loss;

      newStock = fromJS(normalObj);

      return newStock;

    } else {

      return stock;

    }

  });
  console.log('HERE----->', newStockArray)
  var newState = state.setIn(['matches', targetMatchIndex,'portfolio','stocks'], newStockArray);

  return newState;


}
