'use strict';
//to gauges made on reflection could have made one
import React from 'react';
import ReactDOM from 'react-dom';
import { toJS } from 'immutable';
import c3 from 'c3';

export const OpponentGauge = React.createClass({

  componentDidMount(){
    var you = Number(this.props.portfolio);
    var opponent = Number(this.props.opponentPortfolio);
    var total = you + opponent;
    var yourPercent = (you/total) * 100;
    var opponentPercent = (you/total)*100;
    this.buildChart(yourPercent.toFixed(2), opponentPercent.toFixed(2));
  },

  buildChart(you, opponent) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: {
        columns: [
          ['Me', you]
        ],
        type: 'gauge'
      },
      color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
          values: [30, 60, 90, 100]
        }
      },
      size: {
          height: 90
      }
    })
  },
  
  render(){
    return (
      <div ref="chart"></div>
    )
  }

});