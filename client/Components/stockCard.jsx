'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

const RaisedButton = require('material-ui/lib/raised-button');
const Card = require('material-ui/lib/card/card');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');

export const Stock = React.createClass({

  render() {
    const { sell, symbol, shares, matchID, userID, price, name, ask, bid, gain_loss, percent_change, marketValue } = this.props;

    return (
      <div>

        <Card className="cardMarginBottom">


          <div className="paddingPortfolio">

            <div className="row centreTitle">
              <h4>{name}</h4>
              <p> Symbol : {symbol} </p>
            </div>

            <div className="row centreTitle container">

              <div className="four columns">
                <h5> Shares: {shares}</h5>
              </div>
              <div className="four columns">
                <h5>Total: ${(shares * price).toFixed(2)}</h5>
              </div>

              <div className="four columns">
                <input type="number" ref="sellNum" min="1" max={shares} step="1" onChange={(event) => {
                  numSharesToSell = event.target.value;
                }} />

                <RaisedButton label="Sell" onClick={() => {
                  let sellOptions = {
                    numShares: numSharesToSell,
                    stockTicker: symbol,
                    matchID: matchID,
                    userID: userID,
                    action: 'sell',
                  };
                  sell(sellOptions);
                }} />
              </div>

            </div>

          </div>

          <CardText className="row">

            <p> Ask : ${ask}</p>
            <p> Bid : ${bid}</p>
            <p> Gain/Loss : {gain_loss}%</p>
            <p> Change : {percent_change}</p>

           < /CardText>

        </Card>

      </div>
    );
  }

});
