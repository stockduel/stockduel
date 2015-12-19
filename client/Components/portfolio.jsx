'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { CreateMatch } from './createMatch.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import { PortfolioView } from './portfolioView.jsx';
import * as Actions from '../actions/actions.js';

var Portfolio = React.createClass({
  // componentWillMount() {
  //   // setTimeout(()=> this.props.updatePrices(this.props.portfolio.get('stocks')), 5000);
  //   this.props.updatePrices(this.props.portfolio.get('stocks'));
  // },
  render() {
    const { buy, sell, createMatch, matchID, userID, portfolio } = this.props;
    let available_cash;
    let portfolioValue;
    if ( this.props.portfolio ) {
      available_cash = +this.props.portfolio.get('available_cash');
      portfolioValue = this.props.portfolio.get('stocks').reduce( (memo, stockObj) => {
        return memo += (+stockObj.get('price') * +stockObj.get('shares'));
      }, +available_cash);
    }
    let visibleComponent;
    visibleComponent = this.props.currentMatchID ? PortfolioView : CreateMatch;
    return React.createElement(
        visibleComponent,
        {available_cash, createMatch, buy, sell, matchID, userID, portfolioValue, portfolio}
      );
      // <visibleComponent {...this.props} available_cash={available_cash} portfolioValue={portfolioValue}/>
    //);
    // if ( !matchId ) {
    //   return (
    //     <div>
    //       <CreateMatch userId={userId} createMatch={createMatch} />
    //     </div>
    //     );
    //check this to make sure it works; may need a 'return'
    
    // );
  }

});
function mapStateToProps(state) {
  /*  
    Loop through matches until matchId === currentMatchId
    This reveals only the current match's portfolio to the Portfolio component
  */
  if (typeof state.toJS === 'function') console.dir(state.toJS());
  let targetMatch;
  state.get('matches').forEach(function(match, index) {
    
    if (match && match.get('matchID') === state.get('currentMatchID')) {
      targetMatch = match;
    }
  });
  return {
    portfolio: targetMatch ? targetMatch.get('portfolio'): null,
    matchID: targetMatch ? targetMatch.get('matchID'): null,
    userID: state.get('userID'),
    currentMatchID: state.get('currentMatchID')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const PortfolioConnected = connect(mapStateToProps, mapDispatchToProps)(Portfolio);
