'use strict';
//used on a users portfolio page
import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'immutable';
import c3 from 'c3';

export const PortfolioDonut = React.createClass ({
  //take the names of the stocks that you have and their values and pass them to the bar graph
  componentDidMount() {
    var portfolio = this.props.portfolio.get('stocks').toJS().reduce(function(portfolio, stock){
      portfolio[stock.name] = (stock.price)*(stock.shares);
      return portfolio;
    }, {}) 
    portfolio['cash'] = this.props.available_cash;
    //trigger the function to render the donut
    this.buildChart(portfolio);
  },

  //above repeated in componentDidUpdate so that on refresh the data stays on the page
  componentDidUpdate() {
    var portfolio = this.props.portfolio.get('stocks').toJS().reduce(function(portfolio, stock){
      portfolio[stock.name] = (stock.price)*(stock.shares);
      return portfolio;
    }, {}) 
    portfolio['cash'] = this.props.available_cash;
    this.buildChart(portfolio);
  },

  buildChart(portfolio) {
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
    return (
      <div ref="donut"></div>
    )
  }

});