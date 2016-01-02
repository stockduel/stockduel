//Master reducer 
//--------------

//imports all action types from actions.js
import { BUY_STOCK, SELL_STOCK, UPDATE_PRICES, SET_CURRENT_MATCH, SET_INITIAL_STATE, CREATE_MATCH, JOIN_MATCH, LOGOUT, BAD_ACTION, CLEAR_ERROR } from '../actions/actions.js';
//import all individual reducers from their respective files
import buyReducer from './buyReducer';
import sellReducer from './sellReducer';
import setMatchReducer from './setMatchReducer';
import setInitialStateReducer from './setInitialStateReducer';
import createMatchReducer from './createMatchReducer';
import joinMatchReducer from './joinMatchReducer';
import errorReducer from './errorReducer';
import logoutReducer from './logoutReducer';
import clearErrorReducer from './clearErrorReducer';
//import functions to deal with immutable state
import {fromJS, toJS} from 'immutable';

//Initial empty state to allow HTML rendering before data arrives
const initialState = fromJS({
    userId: '',
    currentMatchId: '',
    error: null,
    matches: [{
      m_id: '',
      portfolio: {
        stocks: [],
        totalValue: '',
        available_cash: ''
      }
    }]
  });

//reducer function that handles all dispatched actions
export default function reducer(state = initialState, action) {
  //switch statement to direct each action type to the correct reducer
  switch (action.type) {
    //handles stock purchases
    case BUY_STOCK:
      return buyReducer(state, action)
    //handles stock sales
    case SELL_STOCK:
      return sellReducer(state, action)
    //sets the currentMatchId property on the state
    case SET_CURRENT_MATCH:
      return setMatchReducer(state, action)
    //gets the user ID upon login and generates the initial state
    case SET_INITIAL_STATE:
      return setInitialStateReducer(state, action)
    //creates a match with the parameters provided by the user
    case CREATE_MATCH:
      return createMatchReducer(state, action)
    //adds the user to a match when they join a head to head contest  
    case JOIN_MATCH:
      return joinMatchReducer(state, action)
    //clears out state when the user logs out of the app
    case LOGOUT:
      return logoutReducer(state, action)
    //sets the error property on state to true  
    case BAD_ACTION:
      return errorReducer(state, action)
    //sets the error property on state to null  
    case CLEAR_ERROR:
      return clearErrorReducer(state, action)
    //if action type isn't defined, dispatched action is ignored and state is returned
    default:
      return state
  }
}
