import { BUY_STOCK, SELL_STOCK } from '../actions/actions.js';
import buyReducer from './buyReducer';
import sellReducer from './sellReducer';

export default function reducer(state, action) {
  switch (action.type) {
    case BUY_STOCK:
      return buyReducer(state, action)
    case SELL_STOCK:
      return sellReducer(state, action)
    default:
      return state
  }
}
