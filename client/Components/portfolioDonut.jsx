'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'immutable';
import c3 from 'c3';

export const PortfolioDonut = React.createClass ({

  componentDidMount(){
    console.log('there---->',this.props.stocks);
    this.buildChart(this.props.stocks);
  },

  buildChart(stocks) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: {
        json : stocks,
        type : 'donut'        
      },
      donut: {
        title: "Portfolio"
      }
    });
  },
  
  render(){
    return (
      <div ref="chart"></div>
    )
  }

});