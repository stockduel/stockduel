
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';

class PortfolioDonut extends React.Component {
  
  constructor() {
    super();
  }

  componentDidMount(){
    this.buildChart(this.props.stocks);
  }

  buildChart(stocks) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: 
          {json : stocks,
          type : 'donut'        
      },
      donut: {
          title: "Portfolio"
      }
    });
  }
  
  render(){
    return (
    <div ref="chart"></div>
    )
  }
};