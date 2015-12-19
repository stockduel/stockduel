'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const Stock = React.createClass({

  render() {
    const { sell, stockSymbol, shares, matchID, userID, price } = this.props;
    console.log('matchID is ' + matchID + ' in Stock');
    return (
      <div>
        <p> {stockSymbol} : {shares} at ${price} </p>
        <input type="number" id={this.props.inputID} min="1" max={shares} step="1" />
        <button onClick={() => {
          let numSharesToSell = Number(document.getElementById(this.props.inputID).value);
          let sellOptions = {
            numShares: numSharesToSell,
            stockTicker: stockSymbol,
            matchID: matchID,
            userID: userID,
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
