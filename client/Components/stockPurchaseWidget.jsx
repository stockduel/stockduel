'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

const RaisedButton = require('material-ui/lib/raised-button');
const TextField = require('material-ui/lib/text-field');

export const StockPurchase = React.createClass({

  render() {
    const { buy, stockSymbol, shares, matchID, userID, price } = this.props;
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

       <RaisedButton 
        label="Buy"
        onClick={() => {
         let buyOptions = {
            numShares: parseInt(numShares, 10),
            stockTicker: stockTicker.toUpperCase(),
            matchID: matchID,
            userID: userID,
            action: 'buy'
          };
          console.log('buyOptions: ', buyOptions);
          buy(buyOptions);
        }
      }/>

      </div>
    );
  }

});