import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';

const RaisedButton = require('material-ui/lib/raised-button');

export const CurrentStock = React.createClass({

  //place to hold temporary variables
  getInitialState() {
      return {
        numSharesToSell: 0
      };
  },

  render() {
    var that = this;
    const { sell, stockSymbol, shares, matchID, userID, price, name } = this.props;
    
    return (
      <div>

        <div className="four columns">
          <h4>{name}</h4>
        </div>

        <div className="five columns">
          <h5 className="inLine"> Shares: {shares}</h5>
          <h5 className="inLine"> Total: ${(shares * price).toFixed(2)}</h5>
        </div>

        <div className="three columns">
          <input type="number" ref="sellNum" min="1" max={shares} step="1" onChange={function (event) {
            that.setState({numSharesToSell: event.target.value})
          }} />

          <RaisedButton label="Sell" onClick={() => {
            let numSharesToSell = that.state.numSharesToSell;
            let sellOptions = {
              numShares: numSharesToSell,
              stockTicker: stockSymbol,
              matchID: matchID,
              userID: userID,
              action: 'sell',
            };
            sell(sellOptions);
          }} />
        </div>

      </div>
    );
  }

});