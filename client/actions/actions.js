//Actions
//-------

//import superagent to make ajax requests
import request from 'superagent';
//import the store
import store from '../store/store.js';
//export all action types as variables to allow using them w/o strings
export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';
export const SET_CURRENT_MATCH = 'SET_CURRENT_MATCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const CREATE_MATCH = 'CREATE_MATCH';
export const JOIN_MATCH = 'JOIN_MATCH';
export const LOGOUT = 'LOGOUT';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const BAD_ACTION = 'BAD_ACTION';

//Buy Actions
//-----------

//After data comes back from the async buy action, it's passed through to buySync and
//sent to dispatch
export function buySync(MatchId, userId, portfolio) {
  return {
    //type determines which reducer the action gets directed to
    type: BUY_STOCK,
    userId: userId,
    MatchId: MatchId,
    portfolio: portfolio
  };
}

//Async buy action makes a post request and dispatches a buySync action
export function buy(options) {
  return (dispatch) => {
    return request.post('/trades/' + options.MatchId + '/' + options.userId)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        // dispatches createError action when backend returns error
        dispatch(createError());
      } else {
        //upon success, dispatch a buySync action and send the user to their portfolio, where trade is reflected
        dispatch(buySync(options.MatchId, options.userId, res.body.data.portfolio));
        window.location.hash="#/portfolio";
      }
    });
  };
}

//Sell Actions
//-----------

//After data comes back from the async sell action, it's passed through to sellSync and
//sent to dispatch
export function sellSync(MatchId, userId, portfolio) {
  return {
    //type determines which reducer the action gets directed to
    type: SELL_STOCK,
    userId: userId,
    MatchId: MatchId,
    portfolio: portfolio
  };
}

//Async sell action makes a post request and dispatches a sellSync action
export function sell(options) {
  return (dispatch) => {
    return request.post('/trades/' + options.MatchId + '/' + options.userId)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        //if the backend returns an error, dispatch a createError action
        dispatch(createError());
      } else {
        //on success, dispatch a sellSync, which updates the user's portfolio
        return dispatch(sellSync(options.MatchId, options.userId, res.body.data.portfolio));
      }

    });
    };
}

//Set Current Match Action
//-----------

//Sets the property 'currentMatchId' on state, which is used to grab match and portfolio information
 export function setCurrentMatch(MatchId) {
    return (dispatch) => {
      window.localStorage.setItem('currentMatchId', MatchId);
      dispatch({
        type: SET_CURRENT_MATCH,
        currentMatchId: MatchId
      })
    }
  }

  //Set Initial State Actions
  //-----------

  //After data comes back from the async setInitialState action, it's passed through to setInitialStateSync
  //and the action to generate the state is fired
  export function setInitialStateSync(state) {
    //currentMatchId is stored in localStorage to allow it to be maintained on refresh
    //this checks to see if there is currently one stored, and uses it if so
    if (localStorage.getItem('currentMatchId')) {
      state.currentMatchId = Number(localStorage.getItem('currentMatchId'));
    }
    return {
      type: SET_INITIAL_STATE,
      state
    }
  }

  export function setInitialState() {
    return (dispatch) => {
      //this action will be called when user attempts to log in.
      //response will include userId and state
      request.get('/state/')
        .end(function(err, res){
        if(err) {
          //error action is fired if an error is received from the backend
          dispatch(createError());
        } else {
          //on successful state generation, fires off sync version of the action
          dispatch(setInitialStateSync(res.body));
        }
      });
    };
   }

   //Create Match Actions
   //-----------

   //Takes match data from async verion of create match and updates state accordingly
   export function createMatchSync(options) {
     return {
       type: CREATE_MATCH,
       currentMatchId: options.m_id,
       match: {
        m_id: options.m_id,
        title: options.title,
        challengee: options.challengee, 
        startdate: options.startdate,
        enddate: options.enddate,
        starting_funds: options.starting_funds,
        status: options.status,
        type: options.type,
        winner: options.winner,
        portfolio: {
          stocks: [],
          available_cash: options.starting_funds,
          totalValue: options.starting_funds   
        }
       }
     }
   }

   //makes post call to the matches/ route with all of the match settings the user selected
   export function createMatch(createOptions) {
     return (dispatch) => {
       request.post('/matches/')
       .send(createOptions)
       .end(function(err, res){
         if(err) {
           //dispatches an error action when an error is received from the backend
           dispatch(createError());
         } else {
           //send the data from the backend through the synchronous version of the action
           dispatch(createMatchSync(res.body.data));
           //clear out any errors that are present, since there was just a successful creation
           dispatch(clearError());
           //redirect the user to the portfolio for their new match
           window.location.hash="#/portfolio";
         }
       });
     };
    }

    //Join Match Actions
    //-----------

    //Takes match data from async verion of join match and updates state accordingly
   export function joinMatchSync(Match) {
    return {
       type: JOIN_MATCH,
       currentMatchId: Match.m_id,
       match: {
        m_id: Match.m_id,
        title: Match.title,
        challengee: Match.challengee, 
        startdate: Match.startdate,
        enddate: Match.enddate,
        starting_funds: Match.starting_funds,
        status: Match.status,
        type: Match.type,
        winner: Match.winner,
        portfolio: {
          available_cash: Match.starting_funds,
          totalValue: Match.starting_funds,
          stocks: []
        }
       }
     }
   }

   //Makes a put call to /matches/:matchId to add the user to the match as the challengee
   export function joinMatch(joinOptions) {
     return (dispatch) => {
       request.put('/matches/' + joinOptions)
       .end(function(err, res) {
         if (err) {
          //if the backend returns an error, dispatch an err action
          dispatch(createError());
          //localStorage is used here because of the desired behavior when this error occurs
          //want to re-render the matches list to pull out invalid matches, but still have error message show
          window.localStorage.setItem('joinMatchError', true);
          // cause componentWillUpdate on joinMatches component
          window.location.hash="#/join";
         } else {
          //on success, dispatch sync version of the action to update state
          dispatch(joinMatchSync(res.body.data));
          // clear joinMatchError on successful join
          window.localStorage.setItem('joinMatchError', null);
          //redirect user to the portfolio of the match she just joined
          window.location.hash="#/portfolio";
         }
       });      
     };
   }

   //Logout Actions
   //-------------

   //Dispatch sync event to clear all data from state on logout
   export function logoutSync() {
    return {
       type: LOGOUT
    }
   }

   //Make post request to /auth/logout route to kill session
   export function logout(options) {
     return (dispatch) => {
       request.post( 'auth/logout' )
       .end(function(err, res) {
         if (err) {
          //dispatch error event if backend responds with error
          dispatch(createError());
         } else {
          //on success, dispatch sync version of logout action to update state
          dispatch(logoutSync());
         }
       });      
     };
   }

   //Error Actions
   //-------------

   //Clears the error from state
   export function clearError() {
    return {
      type: CLEAR_ERROR
    }
   }

   //Sets the error property on state equal to true
   export function createError() {
    return {
      type: BAD_ACTION
    }
   }
