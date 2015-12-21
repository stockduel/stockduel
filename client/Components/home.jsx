'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions.js';
// import request from 'superagent';

export const Home = React.createClass({
  // componentWillMount() {
    // this.props.updatePrices(this.props.portfolio.get('stocks'));
  // },
  render() {
    return (
      <div className="container">
        <div className="centreTitle">
          <h2>StockDuel</h2>
          <h6>Fantasy Stock Trading</h6>
        </div>
        <h5>
          1. Join or make a match
        </h5> 
        <h5>
          2. Create a portfolio
        </h5>
        <h5>
          3. Beat your oponents portfolio
        </h5>
        <div className="centreTitle" >
          <a href="/auth/facebook"><img className="imgWidth" src='../assets/images/login.png' alt="facebook login button" /></a>
        </div>
      </div>
    );
  }

});
