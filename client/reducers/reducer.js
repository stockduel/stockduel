import { BUY_STOCK, SELL_STOCK, UPDATE_PRICES, SET_CURRENT_MATCH, SET_INITIAL_STATE, CREATE_MATCH } from '../actions/actions.js';
import buyReducer from './buyReducer';
import sellReducer from './sellReducer';
import updatePricesReducer from './updatePricesReducer';
import setMatchReducer from './setMatchReducer';
import setInitialStateReducer from './setInitialStateReducer';
import createMatchReducer from './createMatchReducer';
import {fromJS, toJS} from 'immutable';

// TODO: generate initial state via AJAX call instead of hardcoding
// 'GET' /users/:userId

//============== Useful pre-populated state for testing ==================\\
// const initialState = fromJS({
//     userId: '123',
//     currentMatchId: '456',
//     matches: [{
//       MatchId: '456',
//       portfolio: {
//         //stock_symbol, shares, price
//         stocks: [],
//         //we need to calculate on the front end
//         totalValue: '1000000',
//         //cash_in_hand
//         available_cash: '1000000'
//       }
//     }]
//   });

//============== Initial empty state to allow HTML rendering before data arrives ===================\\
const initialState = fromJS({
    userId: '',
    currentMatchId: '',
    matches: [{
      m_id: '',
      portfolio: {
        //stock_symbol, shares, price
        stocks: [],
        //we need to calculate on the front end
        totalValue: '',
        //cash_in_hand
        available_cash: ''
      }
    }]
  });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case BUY_STOCK:
      return buyReducer(state, action)
    case SELL_STOCK:
      return sellReducer(state, action)
    case UPDATE_PRICES:
      return updatePricesReducer(state, action)
    case SET_CURRENT_MATCH:
      return setMatchReducer(state, action)
    case SET_INITIAL_STATE:
      return setInitialStateReducer(state, action) 
    case CREATE_MATCH:
      return createMatchReducer(state, action)   
    default:
      return state
  }
}




