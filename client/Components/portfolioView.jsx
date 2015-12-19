import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';

export const PortfolioView = React.createClass({

  componentWillMount() {
    let matchID = this.props.matchID;
    let userID = this.props.userID;
    if (this.props.portfolio) {
      this.props.getMatchPortfolio(matchID, userID);
    }
  },

  render() {

    const { buy, sell, createMatch, matchID, userID, portfolioValue, available_cash, getMatchPortfolio } = this.props;

    return (
      <div>
        <h4>You have ${available_cash.toFixed(2)} available cash</h4>
        <h4>Your portfolio is worth ${portfolioValue.toFixed(2)}</h4>

        <ul>
          {this.props.portfolio.get('stocks').map((stockObj, index) => {
            // TODO: condense props into one object and pass it through as attribute
            console.log('STOCK OBJ', stockObj.toJS());
            return (
              <Stock 
                key={index}
                sell={sell}
                matchID={matchID}
                userID={userID}
                stockSymbol={stockObj.get('stockSymbol')}
                shares={stockObj.get('shares')}
                price={stockObj.get('price')}
                ask={stockObj.get('ask')}
                bid={stockObj.get('bid')}
                gain_loss={stockObj.get('gain_loss')}
                marketValue={stockObj.get('marketValue')}
                name={stockObj.get('name')}
                percent_change={stockObj.get('percent_change')}
              />);
          })}
        </ul>

      </div>
    );
  }

});
