//Logout Reducer
//--------------------

//import function to create immutable object
import {fromJS} from 'immutable';

//sets state back to an empty state object when the user logs out
export default function (state, action) {
  return fromJS({
    userId: '',
    currentMatchId: '',
    matches: [{
      m_id: '',
      portfolio: {
        stocks: [],
        totalValue: '',
        available_cash: ''
      }
    }]
  });
}