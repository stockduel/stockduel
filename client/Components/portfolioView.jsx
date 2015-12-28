import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';

export const PortfolioView = React.createClass({

  render() {
    const { buy, sell, createMatch, MatchId, userId, portfolioValue, available_cash, portfolio } = this.props;
    return (
      <div className="container paddingTop">
        <h2 className="centreTitle">You have ${available_cash.toFixed(2)} available cash.</h2>
        <h2 className="centreTitle">Your portfolio is worth ${portfolioValue.toFixed(2)}.</h2>
        <StockPurchase buy={buy} MatchId={MatchId} userId={userId} />

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
            />
          })}
        </ul>
      </div>
    );
  }

});
