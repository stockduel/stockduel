'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const Stock = React.createClass({

  render() {
    const { sell, symbol, shares, matchId, userId, price } = this.props;
    
    return (
      <div>
        <p> {symbol} : {shares} at ${price} </p>
        <input type="number" id="sellSharesInput" min="1" max={shares} step="1" />
        <button onClick={() => {
          let numSharesToSell = document.getElementById('sellSharesInput').value;
          let sellOptions = {
            shares: numSharesToSell,
            stockSymbol: symbol,
            matchId: matchId,
            userId: userId,
            // hardcode price until AJAX call works
            price: '112'
          };
          sell(sellOptions); // trigger action creator in actions.js
        }}> Sell </button>
      </div>
    );
  }

});
