import request from 'superagent';
import store from '../store/store.js';
export const BUY_STOCK = 'BUY_STOCK';
export const SELL_STOCK = 'SELL_STOCK';
export const UPDATE_PRICES = 'UPDATE_PRICES';
export const SET_CURRENT_MATCH = 'SET_CURRENT_MATCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const CREATE_MATCH = 'CREATE_MATCH';

export function buySync(matchID, userID, portfolio) {
  return {
    type: BUY_STOCK,
    userID: userID,
    matchID: matchID,
    portfolio: portfolio
  };
}

export function buy(options) {
  return (dispatch) => {
   //requires: numShares, action (buy), stockTicker
    return request.post('/trades/' + options.matchID + '/' + options.userID)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        // handle error
        return dispatch({type: 'FAILED_TRADE'});
      } else {
        return dispatch(buySync(options.matchID, options.userID, res.body.data.portfolio));
      }

    });
    };
}


export function sellSync(matchID, userID, portfolio) {
  return {
    type: SELL_STOCK,
    userID: userID,
    matchID: matchID,
    portfolio: portfolio
  };
}
export function sell(options) {
  return (dispatch) => {
    //  requires: numShares, action (sell), stockTicker
    return request.post('/trades/' + options.matchID + '/' + options.userID)
    .send(options)
    .end(function(err, res) {
      if (err || !res.body.data) {
        // handle error
        console.log('err:', err, 'res.body', res.body);
        return dispatch({type: 'FAILED_TRADE'});
      } else {
        return dispatch(sellSync(options.matchID, options.userID, res.body.data.portfolio));
      }

    });
    };
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
    // success callback pass in data as portfolio.stocks array
    //request.post('stocks/')
    request.post('/stocks/update')
    .send(oldStockArray)
    .end(function(err, res){
      if(err) {
        //handle error
        dispatch({type: 'FAILED_TO_LOAD_PRICES'});
      } else {
        dispatch(updatePricesSync(res.body.stockArray));
      }
    });
    // dispatch(updatePricesSync(oldStockArray));
    };
 }

 export function setCurrentMatch(matchID) {
    return (dispatch) => {
      dispatch({
        type: SET_CURRENT_MATCH,
        currentMatchId: matchID
      })
    }
  }

  export function setInitialStateSync(state) {
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
          window.location.hash="#/";
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
        startDate: options.startdate,
        endDate: options.enddate,
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
    console.log('options', createOptions);
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

