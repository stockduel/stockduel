import request from 'superagent';
import store from '../store/store.js';
export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';
export const UPDATE_PRICES = 'UPDATE_PRICES';
export const SET_CURRENT_MATCH = 'SET_CURRENT_MATCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const CREATE_MATCH = 'CREATE_MATCH';
export const JOIN_MATCH = 'JOIN_MATCH';
export const LOGOUT = 'LOGOUT';

export function buySync(MatchId, userId, portfolio) {
  return {
    type: BUY_STOCK,
    userId: userId,
    MatchId: MatchId,
    portfolio: portfolio
  };
}

export function buy(options) {
  return (dispatch) => {
   //requires: numShares, action (buy), stockTicker
    return request.post('/trades/' + options.MatchId + '/' + options.userId)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        // handle error
        return dispatch({type: 'FAILED_TRADE'});
      } else {
        return dispatch(buySync(options.MatchId, options.userId, res.body.data.portfolio));
      }

    });
    };
}


export function sellSync(MatchId, userId, portfolio) {
  return {
    type: SELL_STOCK,
    userId: userId,
    MatchId: MatchId,
    portfolio: portfolio
  };
}
export function sell(options) {
  return (dispatch) => {
    //  requires: numShares, action (sell), stockTicker
    return request.post('/trades/' + options.MatchId + '/' + options.userId)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        // handle error
        console.log('err:', err, 'res.body', res.body);
        return dispatch({type: 'FAILED_TRADE'});
      } else {
        return dispatch(sellSync(options.MatchId, options.userId, res.body.data.portfolio));
      }

    });
    };
}

 export function setCurrentMatch(MatchId) {
    return (dispatch) => {
      window.localStorage.setItem('currentMatchId', MatchId);
      dispatch({
        type: SET_CURRENT_MATCH,
        currentMatchId: MatchId
      })
    }
  }

  export function setInitialStateSync(state) {
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
      /* 
        this action will be called when user attempts to log in.
        response will include userId and state
       */
      request.get('/state/')
        .end(function(err, res){
        if(err) {
          //handle error
          console.log('There was an error on GET from route /state', err);
          dispatch({type: 'FAILED_TO_LOAD_STATE'});
        } else {
          dispatch(setInitialStateSync(res.body));
          // window.location.hash="#/";
        }
      });
    };
   }

   export function createMatchSync(options) {
    enddate: "2016-01-01T14:00:00.000Z"
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

   //this will need to be updated once we support matches with two players
   export function createMatch(createOptions) {
     return (dispatch) => {
       request.post('/matches/')
       .send(createOptions)
       .end(function(err, res){
         if(err) {
           //handle error
           dispatch({type: 'FAILED_TO_CREATE_MATCH'});
         } else {
           dispatch(createMatchSync(res.body.data));
         }
       });
     };
    }

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

   export function joinMatch(joinOptions) {
     return (dispatch) => {
       request.put('/matches/' + joinOptions)
       .end(function(err, res) {
         if (err) {
          dispatch({type: 'FAILED_TO_JOIN_MATCH'});
         } else {
          dispatch(joinMatchSync(res.body.data));
         }
       });      
     };
   }

   export function logoutSync() {
    return {
       type: LOGOUT
    }
   }

   export function logout(options) {
     return (dispatch) => {
       request.post( 'auth/logout' )
       .end(function(err, res) {
         if (err) {
          dispatch({type: 'FAILED_TO_LOGOUT'});
         } else {
          dispatch(logoutSync());
         }
       });      
     };
   }   
