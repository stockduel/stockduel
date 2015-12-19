import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';

export const PortfolioView = React.createClass({

  // componentWillMount() {
  //   let matchID = this.props.matchID;
  //   let userID = this.props.userID;
  //   this.props.getMatchPortfolio(matchID, userID);
  // },

  render() {

    const { buy, sell, createMatch, matchID, userID, portfolioValue, available_cash, getMatchPortfolio } = this.props;

    return (
      <div>
        <h2>You have ${available_cash.toFixed(2)} available cash.</h2>
        <h2>Your portfolio is worth ${portfolioValue.toFixed(2)}.</h2>

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
              />);
          })}
        </ul>

      </div>
    );
  }

});
