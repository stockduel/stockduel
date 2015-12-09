import request from 'superagent';

export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';

// export function buy(options) {
//   return {
//     type: BUY_STOCK,
//     userId: options.userId,
//     matchId: options.matchId,
//     stockSymbol: options.stockSymbol,
//     price: options.price,
//     shares: options.shares
//   }
// }

export function buy(options) {
  return (dispatch) => {
    request.post('/matches/' + options.matchId + '/' + options.userId)
    .send(options)
    .end(function(err, res){
      if (err) {
        return {type: 'EAT_PANCAKES'};
      } else {
        return dispatch(Object.assign({}, res.body, {type: BUY_STOCK}));  // expects server to respond with action object
      }
    });
  }
}

// export function sell(options) {
//   return {
//     type: SELL_STOCK,
//     userId: options.userId,
//     matchId: options.matchId,
//     stockSymbol: options.stockSymbol,
//     price: options.price,
//     shares: options.shares
//   }
// }
export function sell(options) {
  return (dispatch) => {
    request.post('/matches/' + options.matchId + '/' + options.userId)
    .send(options)
    .end(function(err, res){
      if (err) {
        return {type: 'EAT_PANCAKES'};
      } else {
        return dispatch(Object.assign({}, res.body, {type: SELL_STOCK}));  // expects server to respond with action object
      }
    });
  }
}