'use strict';
import React from 'react';
import { bindActionCreators } from 'redux';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import { buy, clearError } from '../actions/actions.js';
import request from 'superagent';
import {toJS} from 'immutable';

const TextField = require('material-ui/lib/text-field');

export const SearchStocksDumb = React.createClass({

  componentWillMount() {
    this.searchResults = this.timeout = null; // timeout for debouncing, to be reset after every invocation of this.debouncedSearch
    this.props.clearError(); // remove potential errors from possible previous invalid purchases
  },

  searchStocks(queryString){
    var url = '/stocks/?search=';
    var self = this;
    request.get(url + queryString)
      .end((err, res) => {
        if (err) {
          console.error("There was a problem searching for stocks:", err);
        } else {
          self.searchResults = res.body.data.sort((a, b) => {
            return b.ask - a.ask;
          }).slice(0, 10); // take first 10 results for clean UX
          window.location.hash="#/search";  // re-render page to display searchResults
        }
      })
  },

  debouncedSearch() {
    var context = this;
    var input = this.refs.searchStocksInput.refs.input;
    function delayed () {
      context.searchStocks(input.value); // invoke searchStocks from original context        
      context.timeout = null; // reset timeout
    }; 

    if (this.timeout){
      clearTimeout(this.timeout);
    }      
    this.timeout = setTimeout(delayed, 100);
  },

  updateStockValue(symbol) {
      this.refs.searchStocksInput.refs.input.value = this.stockTicker = symbol;
      window.location.hash = "#/search"; // artificial refresh to re-render StockPurchase
      window.scrollTo(0, 0); // scroll to top of page to see input field
  },

  render() {
    this.stockTicker = this.stockTicker || '';
    const {MatchId, userId, buy, MatchTitle, isActive, errorValue} = this.props;
    return (
      <div className="cardMarginBottom paddingTop">
        <h3>{MatchTitle && MatchTitle + (isActive ? '' : ' is not currently active')}</h3>
        {!MatchId && <h4><strong>Just browsing . . .</strong></h4>}
        <div>
          <TextField hintText="Stock Symbol" ref="searchStocksInput" onKeyDown={this.debouncedSearch} onChange={(e) => {
            this.updateStockValue(e.target.value);
          }}/>
        </div>
        <div className="results">
          <ul>
            {this.searchResults === null ?
              null : 
              this.searchResults.map(result => {
                if(result.ask) { // certain stocks in database have to ask price -- filter those out
                  return (
                    <li key={result.symbol} onClick={() => this.updateStockValue(result.symbol)}>
                      <strong>{result.symbol}</strong>: {result.name} -- <em>${result.ask}</em>
                    </li>

                  )
                }
              })
          }
          </ul>
        </div>
        {isActive && <StockPurchase stockTicker={this.stockTicker} buy={buy} MatchId={MatchId} userId={userId} errorValue={errorValue} />}
      </div>
    )
  }
});

function mapStateToProps(state) {
  let targetMatch;
  if (state.get('currentMatchId')) {
    state.get('matches').forEach((match, index) => {    
      if (match.get('m_id') === state.get('currentMatchId')) {
        targetMatch = match;
      }
    });
  }
  return {
    userId: state.get('userId'),
    MatchId: state.get('currentMatchId'),
    MatchTitle: targetMatch ? targetMatch.get('title') : '',
    isActive: targetMatch && targetMatch.get('status') === 'active',
    errorValue: state.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({buy, clearError}, dispatch);
}

export const SearchStocks = connect(mapStateToProps, mapDispatchToProps)(SearchStocksDumb);
