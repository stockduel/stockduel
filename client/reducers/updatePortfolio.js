import {List, Map, toJS} from 'immutable';

//see buy reducer
//get the state of the current match
//loop down and get the stocks then find correct one to update/add to

export default function addStockReducer(state, action) {
  //find the match you are in
  var targetMatch;
  console.log('in reducer', action);
  state.get('matches').forEach(function(match, index) {
    if (match.get('matchID') === action.match_id) {
      targetMatch = match;
    }
  });

  var stocks = targetMatch.getIn(['portfolio', 'stocks']);

  var newStock;

  var newStockArray = stocks.map((stock, index) => {

    if(stock.toJS().stockSymbol === action.symbol) {

      var normalObj = stock.toJS();

      normalObj.name = action.stocks.name;
      normalObj.ask = action.stocks.ask;
      normalObj.bid = action.stocks.bid;
      normalObj.percent_change = action.stocks.percent_change;
      normalObj.marketValue = action.stocks.marketValue;
      normalObj.gain_loss = action.stocks.gain_loss;

      newStock = normalObj;
      return newStock;

    }

    console.log('COMPLETE MAP', newStockArray);
    var newState = state.set('stocks', newStockArray);

    return newState;

  });

};
