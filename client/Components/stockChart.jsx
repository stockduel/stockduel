import React from 'react';
import ReactDOM from 'react-dom';
import c3 from 'c3';
import request from 'superagent';

//Chart used in each stock card to show the stock performance over the last year
export const StockChart = React.createClass ({

  //call the server to send a request to yahoo to get the data for each trade day over the last x weeks
  componentWillMount () {
    
    let close = [];
    let xAxis = [];
    let self = this;

    request.get('/stocks/history/'+this.props.symbol+'/'+this.props.startdate)
    .end(function(err, res) {
      if (err) {
        console.error(err);
      } else {
        var stockInfo = res.body;
        
        //make array of close data start with 'close' as first element for c3 
        close = stockInfo.close;
        close.unshift('close')

        //make the array of dates have x at start for c3
        xAxis = stockInfo.dates;
        xAxis.unshift('x');

        //send the data to the chartBuild method
        self.buildChart(close, xAxis);
      }
      
    });



  },

  buildChart(close, xAxis) {
    c3.generate({
      bindto: ReactDOM.findDOMNode(this.refs.chart),
      //data to pass to the graph
      data: {
        x: 'x',
        columns: [
          xAxis,
          close
        ]
      },
      axis: {
        y: {
          //define the axis label and position
          label: {
            text: 'Closing Price in $',
            position: 'outer-middle'
          }
        },
        x: {
          //define the fields on the x axis
          type: 'timeseries',
          tick: {
            format: '%Y-%m'
          },
          //define the axis label and position
          label: {
            text: 'Date',
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