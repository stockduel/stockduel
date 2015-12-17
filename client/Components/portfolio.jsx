'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';

var Portfolio = React.createClass({
  // componentWillMount() {
  //   // setTimeout(()=> this.props.updatePrices(this.props.portfolio.get('stocks')), 5000);
  //   this.props.updatePrices(this.props.portfolio.get('stocks'));
  // },
  render() {
    const { buy, sell, matchId, userId } = this.props;
    const availableCash = this.props.portfolio.get('availableCash');
    //check this to make sure it works; may need a 'return'
    let portfolioValue = this.props.portfolio.get('stocks').reduce( (memo, stockObj) => {
      memo += (stockObj.price * stockObj.shares);
    }, availableCash);
    return (
      <div>
        <h2>You have ${this.props.portfolio.get('availableCash')} available cash.</h2>
        <h2>Your portfolio is worth ${portfolioValue}.</h2>
        <StockPurchase buy={buy} matchId={matchId} userId={userId} />
        <ul>
          {this.props.portfolio.get('stocks').map(stockObj => {
            // TODO: condense props into one object and pass it through as attribute
            return <Stock key={stockObj.get('stockSymbol')} sell={sell} matchId={matchId} userId={userId} symbol={stockObj.get('stockSymbol')} shares={stockObj.get('shares')} price={stockObj.get('price')} />
          })}
        </ul>
      </div>
    );
  }

});
function mapStateToProps(state) {
  /*  
    Loop through matches until matchId === currentMatchId
    This reveals only the current match's portfolio to the Portfolio component
  */
  let targetMatch;
  state.get('matches').forEach(function(match, index) {
    if (match.get('matchId') === state.get('currentMatchId')) {
      targetMatch = match;
    }
  });
  return {
    portfolio: targetMatch.get('portfolio'),
    matchId: targetMatch.get('matchId'),
    userId: state.get('userId')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const PortfolioConnected = connect(mapStateToProps, mapDispatchToProps)(Portfolio);
