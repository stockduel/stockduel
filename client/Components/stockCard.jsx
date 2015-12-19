'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const Stock = React.createClass({

  render() {

    const { sell, stockSymbol, shares, matchID, userID, price } = this.props;
    
    return (
      <div>
        <p> You currently own: {shares} shares at ${price} each.</p>
        <p> Current total value of shares: ${(shares * price).toFixed(2)}</p>

        <input type="number" id={this.props.inputID} min="1" max={shares} step="1" />
        <button onClick={() => {
          let numSharesToSell = Number(document.getElementById(this.props.inputID).value);
          let sellOptions = {
            numShares: numSharesToSell,
            stockTicker: symbol,
            matchId: matchId,
            userId: userId,
            action: 'sell',
            // hardcode price until AJAX call works
            // price: '112'
          };
          sell(sellOptions); // trigger action creator in actions.js
        }}> Sell </button>
      </div>
    );
  }

});
