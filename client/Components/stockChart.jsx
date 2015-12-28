
import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';
//need a route to get the stock data from the stock_prices table of the history of the stocks plot buy and sell?

export const StockChart = React.createClass ({

  componentDidMount(){
    this.buildChart(this.props.stocks);
  },

  buildChart(stocks) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      data: {
      columns: [
        ['ask', 30, 50, 40, 44],
        ['bid', 35, 49, 46, 46]
        ]
      },
      axis: {
        y: {
          label: {
            text: 'Amount in $',
            position: 'outer-middle'
          }
        },
        x: {
          label: {
            text: 'Days Since Bought',
            position: 'outer-middle'
          }
        }
      }
    });
  },
  
  render(){
    return (
      <div ref="chart" className="c3Line" ></div>
    )
  }
});