//Deprecated
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'immutable';
import c3 from 'c3';

export const BarGraph = React.createClass({

  componentDidMount(){
    this.buildChart(this.props.match);
  },

  buildChart(match) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),

      data: 
          {json : match,
          type : 'bar'        
      },
      interaction: {
       enabled: false
      },
      bar: {
        width: {
            ratio: 0.25, // this makes bar width 50% of length between ticks
            zerobased: false
        }
      },
      // color: {
      //   pattern: ['#1f77b4', '#aec7e8']
      // }
    });
  },
  
  render(){
    return (
    <div ref="chart"></div>
    )
  }
});