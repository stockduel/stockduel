'use strict';
//NB.this page need to have the this.props.inputID to work
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const RaisedButton = require('material-ui/lib/raised-button');

export const Stock = React.createClass({

  //place to hold temporary variables
  getInitialState() {
      return {
        numSharesToSell: 0
      };
  },

  render() {
    var that = this;
    const { sell, stockSymbol, shares, matchID, userID, price, bid, ask, percent_change, gain_loss, marketValue, name } = this.props;
    
    return (
      <div className="container">

        <Card>
          <div className="row container">
            <div className="three columns">
              <h4>{name}<span>{stockSymbol}</span></h4>
            </div>

            <div className="two columns">
              <h5> Shares: {shares}</h5>
            </div>

            <div className="two columns">
              <h5> Total: ${(shares * price).toFixed(2)}</h5>
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

          <CardText>
            
           <ul>
             <li>Ask: ${ask}</li>
             <li>Bid: ${bid}</li>
             <li>Percentage Change: {percent_change}%</li>
             <li>Market Value: ${marketValue}</li>
             <li>Days gain/loss: {gain_loss}%</li>
           </ul>

          < /CardText>

        </Card>
        


      </div>
    );
  }

});
