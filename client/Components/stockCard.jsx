'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const Stock = React.createClass({

  render() {
    const { sell, symbol, shares, matchID, userID, price, name, ask, bid, gain_loss, percent_change, marketValue } = this.props;

    return (
      <div>

        <p> {shares} shares at ${price} </p>
        <p> Name : {name} </p>
        <p> Symbol : {symbol} </p>
        <p> Ask : ${ask}</p>
        <p> Bid : ${bid}</p>
        <p> Gain/Loss : {gain_loss}%</p>
        <p> Change : {percent_change}</p>

        <input type="number" id={this.props.inputID} min="1" max={shares} step="1" />
        <button onClick={() => {
          let numSharesToSell = Number(document.getElementById(this.props.inputID).value);
          let sellOptions = {
            numShares: numSharesToSell,
            stockTicker: symbol,
            matchID: matchID,
            userID: userID,
            action: 'sell'
            // hardcode price until AJAX call works
            // price: '112'
          };
          sell(sellOptions); // trigger action creator in actions.js
        }}> Sell </button>
      </div>
    );
  }

});
