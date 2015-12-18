'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const StockPurchase = React.createClass({

  render() {
    const { buy, stockSymbol, shares, matchID, userID, price } = this.props;
    
    return (
      <div>
       <h4>Buy some stocks:</h4> 
           <input id="symbolInput" type="text" placeholder="Stock symbol . . ." />
           <input id="numSharesInput" type="number" min="5" step="5" />
           <button onClick={() => {
             let buyOptions = {
               numShares: +document.getElementById('numSharesInput').value,
               stockTicker: document.getElementById('symbolInput').value.toUpperCase(),
               matchID: this.props.matchID,
               userID: this.props.userID,
               action: 'buy'/*,*/
               //this price is here just so it doesn't break right now; really this will come from async call
               // price: '111' 
             }
             buy(buyOptions); // triggers action creator in actions.js
           }}>Purchase</button>
      </div>
    );
  }

});