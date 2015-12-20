'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';

//-----------buy stock nested view-----------//
export const StockPurchase = React.createClass({

  render() {
    const { buy, matchID, userID } = this.props;
    
    return (
      
      <div>
        <h4>Buy some stocks:</h4> 
         Stock Symbol: <input id="symbolInput" type="text" placeholder="Stock symbol . . ." />
         Number of Shares: <input id="numSharesInput" type="number" min="5" step="5" />
         <button onClick={() => {
           let buyOptions = {
             numShares: +document.getElementById('numSharesInput').value,
             stockTicker: document.getElementById('symbolInput').value.toUpperCase(),
             matchID: this.props.matchID,
             userID: this.props.userID,
             action: 'buy'
           }
           buy(buyOptions); // triggers action creator in actions.js
        }}>Purchase</button>
      </div>

    );
  }

});