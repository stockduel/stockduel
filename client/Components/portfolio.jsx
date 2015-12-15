'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import * as TradeActions from '../actions/actions.js';
import request from 'superagent';

var Portfolio = React.createClass({
  componentWillMount() {
    // TODO: dispatch UPDATE_PRICES action
    setTimeout(()=> this.props.updatePrices(this.props.portfolio.get('stocks')), 5000);
    // this.props.updatePrices(this.props.portfolio.get('stocks'));
  },
  render() {
    const { buy, sell, symbol, shares, matchId, userId, price } = this.props;
    return (
      <div>
        <h2>Lucus and CJ ${this.props.portfolio.get('availableCash')} in your portfolio.</h2>
        <h4>Buy some stocks:</h4> 
        <input id="symbolInput" type="text" placeholder="Stock symbol . . ." />
        <input id="numSharesInput" type="number" min="5" step="5" />
        <button onClick={() => {
          let buyOptions = {
            shares: document.getElementById('numSharesInput').value,
            stockSymbol: document.getElementById('symbolInput').value,
            matchId: this.props.matchId,
            userId: this.props.userId,
            //this price is here just so it doesn't break right now; really this will come from async call
            price: '111' 
          }
          buy(buyOptions); // triggers action creator in actions.js
        }}>Purchase</button>
        <ul>
          {this.props.portfolio.get('stocks').map(stockObj => {
            // TODO: condense props into one object and pass it through as attribute
            return <Stock sell={sell} matchId={matchId} userId={userId} symbol={stockObj.get('stockSymbol')} shares={stockObj.get('shares')} price={stockObj.get('price')} />
          })}
        </ul>
      </div>
    );
  }

});
function mapStateToProps(state) {
  /*  This solution only works when users have one match
      We grab the 0th element of matches array which is the one and only match
      TODO: have container component dictate which match is available in Portfolio
  */
  return {
    portfolio: state.get('matches').get(0).get('portfolio'),
    matchId: state.get('matches').get(0).get('matchId'),
    userId: state.get('userId')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TradeActions, dispatch);
}

export const PortfolioConnected = connect(mapStateToProps, mapDispatchToProps)(Portfolio);
