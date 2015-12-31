'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import { PortfolioView } from './portfolioView.jsx';
import * as Actions from '../actions/actions.js';

var Portfolio = React.createClass({

  componentWillMount() {
      this.props.clearError(); // clear error from previous invalid sales, or errors from other pages  
  },

  render() {

    const { buy, sell, createMatch, MatchId, userId, portfolio, startdate, MatchTitle, errorValue } = this.props;

    let available_cash = portfolio ? portfolio.get('available_cash') : 0;
    let portfolioValue = portfolio ? portfolio.get('totalValue') : 0;

    return React.createElement(
      PortfolioView,
      { available_cash, createMatch, buy, sell, MatchId, userId, portfolioValue, portfolio, startdate, MatchTitle, errorValue }
    );

  }

});
function mapStateToProps(state) {
  /*  
    Loop through matches until MatchId === currentMatchId
    This reveals only the current match's portfolio to the Portfolio component
  */

  let targetMatch;
  //if a match has already been selected
  state.get('matches').forEach(function(match, index) {
    
    if (match.get('m_id') === state.get('currentMatchId')) {
      targetMatch = match;
    }

  });

  return {
    //if a match has been selected
    portfolio: targetMatch ? targetMatch.get('portfolio'): null,
    MatchId: targetMatch ? targetMatch.get('m_id'): null,
    MatchTitle: targetMatch ? targetMatch.get('title'): null,
    startdate: targetMatch ? targetMatch.get('startdate'): null,

    //irrespective of whether a match has been selected
    userId: state.get('userId'),
    currentMatchId: state.get('currentMatchId'),
    errorValue: state.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const PortfolioConnected = connect(mapStateToProps, mapDispatchToProps)(Portfolio);
