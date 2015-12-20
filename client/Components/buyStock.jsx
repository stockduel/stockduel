'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { StockPurchase } from './stockPurchaseWidget.jsx';

// import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from './../actions/actions.js';

//--------------page on which to search for stocks------------//
const Search = React.createClass({
  render() {
    const { buy, matchID, userID } = this.props;
    return(

      <div>
        <h2>Search Stocks Page</h2>
        <StockPurchase buy={buy} matchID={matchID} userID={userID} />
      </div>
    
    );

  }

});

function mapStateToProps(state) {
  /*  
    Loop through matches until matchId === currentMatchId
    This reveals only the current match's portfolio to the Portfolio component
  */
  console.log('state is in search', state.toJS());
  console.log('USERID',state.get('userID') )
  let targetMatch;
  state.get('matches').forEach(function(match, index) {
    
    if (match && match.get('matchID') === state.get('currentMatchID')) {
      targetMatch = match;
    }
  });
  return {
    portfolio: targetMatch ? targetMatch.get('portfolio'): null,
    matchID: targetMatch ? targetMatch.get('matchID'): null,
    userID: state.get('userID'),
    currentMatchID: state.get('currentMatchID')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const SearchConnected = connect(mapStateToProps, mapDispatchToProps)(Search);