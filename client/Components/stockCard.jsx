'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { CurrentStock } from './currentStock.jsx';

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const RaisedButton = require('material-ui/lib/raised-button');

export const Stock = React.createClass({

  render() {
    var that = this;
    const { sell, stockSymbol, shares, matchID, userID, price, bid, ask, percent_change, gain_loss, marketValue, name } = this.props;
    
    return (
      <div className="container">

        <Card className="cardMarginBottom">

          <div className="row paddingPortfolio">
            <CurrentStock sell={sell} shares={shares} matchID={matchID} userID={userID} stockSymbol={stockSymbol} price={price} name={name} />
          </div>

          <CardText className="row">
            
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
