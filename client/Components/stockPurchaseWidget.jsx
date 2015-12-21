'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';

//-----------buy stock nested view-----------//
const RaisedButton = require('material-ui/lib/raised-button');
const TextField = require('material-ui/lib/text-field');
const Dialog = require('material-ui/lib/dialog');

export const StockPurchase = React.createClass({

  render() {

    const { buy, matchID, userID } = this.props;
    let stockTicker;
    let numShares;

    return (
      
      <div>
        <h4>Buy some stocks:</h4> 
         <TextField hintText="Stock Symbol" onChange={ function () {
          stockTicker = arguments[0].target.value;
         }} />
         <TextField hintText="Number of Stocks" onChange={ function () {
          numShares = arguments[0].target.value;
         }} />
         <RaisedButton label="Buy" onClick={() => {
           let buyOptions = {
             numShares: parseInt(numShares, 10),
             stockTicker: stockTicker.toUpperCase(),
             matchID: this.props.matchID,
             userID: this.props.userID,
             action: 'buy'
           }
           buy(buyOptions);
        }} />

      </div>

    );
  }

});