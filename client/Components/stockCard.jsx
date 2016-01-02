'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { StockChart } from './stockChart.jsx';

const RaisedButton = require('material-ui/lib/raised-button');
const Card = require('material-ui/lib/card/card');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');

//card that displays details of a users stock. Used in portfolio view.
export const Stock = React.createClass({

  render() {
    const { sell, symbol, shares, MatchId, userId, price, name, ask, bid, gain_loss, percent_change, marketValue, startdate, errorValue, matchStatus } = this.props;
    let numSharesToSell;

    return (
      <div>

        <Card className="cardMarginBottom portfolioStockCards">


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

            {/*logic to show the sell compont only when the match is active*/}
              {matchStatus !== 'complete' && <div className="four columns">
                <input type="number" ref="sellNum" min="1" max={shares} step="1" onChange={(event) => {
                  numSharesToSell = event.target.value;
                }} />

               <RaisedButton label="Sell" onClick={() => {
                  let sellOptions = {
                    numShares: numSharesToSell,
                    stockTicker: symbol,
                    MatchId: MatchId,
                    userId: userId,
                    action: 'sell',
                  };
                  {/*empty the input box for the user*/}
                  this.refs.sellNum.value="";
                  {/*trigger action to sell stocks. Update the database and state*/}
                  sell(sellOptions);
                }} />

              {/*handle error*/}
                {errorValue && <div className="error">
                  <p>Invalid sale. Please make sure you are not selling more shares than you own.</p>
                </div>}

              </div>
              }
            </div>

          </div>

          <CardText className="row">
            {/*stock data displayed to the user*/}
            <div className="three columns paddingTopStocks">
              <p> Ask : ${ask}</p>
              <p> Bid : ${bid}</p>
              <p> Gain/Loss : ${gain_loss.toFixed(2)}</p>
              <p> Change : {percent_change}</p>
            </div>

          {/*stock chart component rendered here to show stock performance over the past year*/}
            <div className="nine columns">
              <StockChart startdate={startdate} symbol={symbol} />
            </div>

           < /CardText>

        </Card>

      </div>
    );
  }

});
