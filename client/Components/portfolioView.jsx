import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';

export const PortfolioView = React.createClass({
  // componentWillMount() {
  //   // setTimeout(()=> this.props.updatePrices(this.props.portfolio.get('stocks')), 5000);
  //   this.props.updatePrices(this.props.portfolio.get('stocks'));
  // },
  render() {
    const { buy, sell, createMatch, matchID, userID, portfolioValue, available_cash } = this.props;
    return (
      <div>
        <h2>You have ${available_cash.toFixed(2)} available cash.</h2>
        <h2>Your portfolio is worth ${portfolioValue.toFixed(2)}.</h2>
        <StockPurchase buy={buy} matchID={matchID} userID={userID} />
        <ul>
          {this.props.portfolio.get('stocks').map((stockObj, index) => {
            // TODO: condense props into one object and pass it through as attribute
            return <Stock key={stockObj.get('stockSymbol')} sell={sell} matchID={matchID} userID={userID} stockSymbol={stockObj.get('stockSymbol')} shares={stockObj.get('shares')} price={stockObj.get('price')} inputID={index} />
          })}
        </ul>
      </div>
    );
  }

});
