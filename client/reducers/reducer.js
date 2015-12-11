import { BUY_STOCK, SELL_STOCK, UPDATE_PRICES } from '../actions/actions.js';
import buyReducer from './buyReducer';
import sellReducer from './sellReducer';
import updatePricesReducer from './updatePricesReducer';
import {fromJS, toJS} from 'immutable';

// TODO: generate initial state via AJAX call instead of hardcoding
const initialState = fromJS({
    userId: '123',
    matches: [{
      title: 'The Match',
      matchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        availableCash: '1000000'
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
    default:
      return state
  }
}
