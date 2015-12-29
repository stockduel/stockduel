'use strict';
import React from 'react';
import { bindActionCreators } from 'redux';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import { buy } from '../actions/actions.js';
import request from 'superagent';

export const SearchStocksDumb = React.createClass({

  componentWillMount() {
    this.searchResults = this.timeout = null; // timeout for debouncing, to be reset after every invocation of this.debouncedSearch
  },

  searchStocks(queryString){
    var url = '/stocks/?search=';
    var self = this;
    request.get(url + queryString)
      .end((err, res) => {
        if (err) {
          console.error("There was a problem searching for stocks:", err);
        } else {
          self.searchResults = res.body.data.slice(0, 10); // take first 10 results for clean UX
          window.location.hash="#/search";  // re-render page to display searchResults
        }
      })
  },

  debouncedSearch() {
    var context = this;
    var input = document.getElementById('searchStocksInput');
    function delayed () {
      var input = document.getElementById('searchStocksInput');
      if (input) {
        context.searchStocks(input.value); // invoke searchStocks from original context        
      }
      context.timeout = null; // reset timeout
    }; 

    if (this.timeout){
      clearTimeout(this.timeout);
    }
    else if (input){
      var queryString = input.value;
      this.searchStocks(queryString);
    }
    this.timeout = setTimeout(delayed, 100);
  },

  updateStockValue(symbol) {
    return () => {
      this.purchaseSymbol=symbol;
      window.location.hash = "#/search"; // artificial refresh to re-render StockPurchase
      window.scrollTo(0, 0); // scroll to top of page to see input field
    }
  },
  render() {
    const {MatchId, userId, buy, MatchTitle, isActive} = this.props;
    return (
      <div>
        {typeof MatchId === 'undefined' && <h4><strong>Just browsing . . .</strong></h4>}
        {MatchId && <StockPurchase valueProp={this.purchaseSymbol || ''} buy={buy} MatchId={MatchId} userId={userId} MatchTitle={MatchTitle} isActive={isActive} />}
        Search all the stocks!
        <div>
          <input type="text" placeholder="Search . . ." id="searchStocksInput" onKeyDown={this.debouncedSearch} />
        </div>
        <div className="results">
          <ul>
            {this.searchResults !== null ? this.searchResults.map(result => {
                return <li key={result.symbol} onClick={this.updateStockValue(result.symbol)}><strong>{result.symbol}</strong>: {result.name} -- <em>${result.ask}</em></li>
              })
            : ''}
          </ul>
        </div>
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
    isActive: targetMatch && targetMatch.get('status') === 'active'
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({buy}, dispatch);
}

export const SearchStocks = connect(mapStateToProps, mapDispatchToProps)(SearchStocksDumb);
