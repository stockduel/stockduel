'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

const FlatButton = require('material-ui/lib/flat-button');
const TextField = require('material-ui/lib/text-field');

//input and button that is linked with actions to update the state when a user want to buy a stock. Nested in search stocks page.
export const StockPurchase = React.createClass({

  render() {
    const { buy, MatchId, userId, stockTicker, errorValue} = this.props;
    let numShares;
    return (
      <div className="purchaseContainer">
         <TextField hintText="Number of Stocks" ref="numSharesInput" onChange={ function () {
          numShares = arguments[0].target.value;
         }} />

         <FlatButton 
          label="Buy"
          hoverColor="#009ACD"
          onClick={() => {
            //send action to buy the shares and update the state
           let buyOptions = {
              numShares: parseInt(numShares, 10),
              stockTicker: stockTicker.toUpperCase(),
              MatchId: MatchId,
              userId: userId,
              action: 'buy'
            };
          {/*empty the number of shares input*/}
            this.refs.numSharesInput.refs.input.value = "";
            buy(buyOptions);
          }
        }/>
        {errorValue && <div className="error">
          <p>Invalid purchase. Make sure the stock symbol is correct, and you have the necessary funds available.</p>
        </div>}
      </div>
    );
  }

});