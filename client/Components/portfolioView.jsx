import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';
import { PortfolioDonut } from './portfolioDonut.jsx';

//format numbers and times
const moment = require('moment');
const numeral = require('numeral');

const RaisedButton = require('material-ui/lib/raised-button');

export const PortfolioView = React.createClass({

  //capitalize the first letter of string
  capFirstLetter (matchTitle) {
    return matchTitle.charAt(0).toUpperCase() + matchTitle.slice(1);
  },

  render() {

    const { buy, sell, createMatch, MatchId, userId, portfolioValue, available_cash, portfolio, startdate, MatchTitle, match, errorValue } = this.props;

    //format the dates from props
    let start = new Date(match.get('startdate'));
    let end = new Date(match.get('enddate'));

    //work out the match status
    let notActive = (<div className="error"><p>{"   starts "+moment(match.get('startdate')).fromNow()}</p></div>);
    let active = (<div className="matchActive"><p>{"   ends in "+moment(match.get('enddate')).fromNow()}</p></div>);
    let complete =(<div><p>{"   finished "+moment(match.get('enddate')).fromNow()}</p></div>);

    let curMessage;

    //assign the status of the match to variable referenced in the html
    if ( moment(new Date()).isAfter(start) && moment(end).isAfter(new Date()) ) {
      curMessage = active;
    } else if ( moment(start).isAfter(new Date()) ) {
      curMessage = notActive;
    } else {
      curMessage = complete;
    }

    return (
      <div className="container paddingTop centreTitle">

        <h2>{this.capFirstLetter(MatchTitle)}<span className="subText">{curMessage}</span></h2>
        <h5>You have ${numeral(Number(available_cash).toFixed(2)).format('0,0')} available cash</h5>
        <h5>Your portfolio is worth ${numeral(Number(portfolioValue).toFixed(2)).format('0,0')}</h5>

        {/*donut of the stocks in your portfolio and how much cash is left*/}
        <PortfolioDonut portfolio={portfolio} available_cash={available_cash} />

        <div className="paddingTop">

          {/*button to go the the search stocks page*/}
          <RaisedButton hoverColor="#009ACD" linkButton={true} href="#/search" label="Buy Stocks" />
        </div>

        <ul>
          {portfolio.get('stocks').map((stockObj, index) => {
          {/*render the stock in your portfolio to the page*/}
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
              matchStatus={match.get('status')}
            />
          })}
        </ul>
        
      </div>
    );
  }

});
