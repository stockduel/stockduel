import request from 'superagent';
import store from '../store/store.js';
export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';
export const UPDATE_PRICES = 'UPDATE_PRICES';

export function buySync(options) {
  return {
    type: BUY_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockSymbol: options.stockSymbol,
    price: options.price,
    shares: options.shares
  }
}

export function buy(options) {
  return (dispatch) => {
  //   request.post('/matches/' + options.matchId + '/' + options.userId)
  //   .send(options)
  //   .end(function(err, res) {
  //     if (err) {
  //       // handle error
  //     } else {
  //       dispatch(Object.assign({}, res.body, {type: BUY_STOCK}));  // expects server to respond with action object
  //     }

  //   });
  //   };
   dispatch(buySync(options));
 }
}


export function sellSync(options) {
  return {
    type: SELL_STOCK,
    userId: options.userId,
    matchId: options.matchId,
    stockSymbol: options.stockSymbol,
    price: options.price,
    shares: options.shares
  }
}
export function sell(options) {
  return (dispatch) => {
    // request.post('/matches/' + options.matchId + '/' + options.userId)
    // .send(options)
    // .end(function(err, res){
    //   if (err) {
    //     return {type: 'EAT_PANCAKES'};
    //   } else {
    //     return dispatch(Object.assign({}, res.body, {type: SELL_STOCK}));  // expects server to respond with action object
    //   }
    // });
  dispatch(sellSync(options));
  }
}

export function updatePricesSync(updatedStockArray) {
  return {
    type: UPDATE_PRICES,
    updatedStockArray: updatedStockArray
  }
}

export function updatePrices(oldStockArray) {
  return (dispatch) => {
    // AJAX call to get new prices
    // success callback pass in data as portoflio.stocks array

    dispatch(updatePricesSync(oldStockArray));
    };
 }
