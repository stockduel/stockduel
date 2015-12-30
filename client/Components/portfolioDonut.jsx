'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'immutable';
import c3 from 'c3';

export const PortfolioDonut = React.createClass ({

  componentDidMount() {
    var portfolio = this.props.portfolio.get('stocks').toJS().reduce(function(portfolio, stock){
      portfolio[stock.name] = (stock.price)*(stock.shares);
      return portfolio;
    }, {}) 
    portfolio['cash'] = this.props.available_cash;
    console.log('---->porto',portfolio)
    setTimeout(this.buildChart(portfolio), 1000);
  },

  componentDidUpdate() {
    var portfolio = this.props.portfolio.get('stocks').toJS().reduce(function(portfolio, stock){
      portfolio[stock.name] = (stock.price)*(stock.shares);
      return portfolio;
    }, {}) 
    portfolio['cash'] = this.props.available_cash;
    console.log('---->porto',portfolio)
    setTimeout(this.buildChart(portfolio), 1000);
  },

  buildChart(portfolio) {
    console.log('in render donut', portfolio)
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.donut),
      data: {
        json : portfolio,
        type : 'donut'        
      },
      donut: {
        title: "Portfolio"
      }
    });
  },
  
  render(){
    console.log('rendering')
    return (
      <div ref="donut"></div>
    )
  }

});