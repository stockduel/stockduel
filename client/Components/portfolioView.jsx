import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';
import { PortfolioDonut } from './portfolioDonut.jsx';
const numeral = require('numeral');

const RaisedButton = require('material-ui/lib/raised-button');

export const PortfolioView = React.createClass({

  render() {

    const { buy, sell, createMatch, MatchId, userId, portfolioValue, available_cash, portfolio, startdate, MatchTitle, errorValue } = this.props;

    return (
      <div className="container paddingTop">
        
        <h1>{MatchTitle}</h1>
        <RaisedButton linkButton={true} href="#/search" label="Add to this portfolio" />
        <h2 className="centreTitle paddingTop">You have ${numeral(Number(available_cash).toFixed(2)).format('0,0')} available cash</h2>
        <h2 className="centreTitle">Your portfolio is worth ${numeral(Number(portfolioValue).toFixed(2)).format('0,0')}</h2>

        <PortfolioDonut portfolio={portfolio} available_cash={available_cash} />

        <ul>
          {portfolio.get('stocks').map((stockObj, index) => {
            // TODO: condense props into one object and pass it through as attribute
            return <Stock 
              sell={sell} 
              MatchId={MatchId} 
              userId={userId} 
              inputID={index}
              key={stockObj.get('symbol')} 
              name={stockObj.get('name')}
              symbol={stockObj.get('symbol')} 
              shares={stockObj.get('shares')} 
              price={stockObj.get('price')} 
              ask={stockObj.get('ask')}
              bid={stockObj.get('bid')}
              gain_loss={stockObj.get('gain_loss')}
              marketValue={stockObj.get('marketValue')}
              percent_change={stockObj.get('percent_change') || 0}
              startdate={startdate}
              errorValue={errorValue}
            />
          })}
        </ul>
      </div>
    );
  }

});
