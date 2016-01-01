'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import * as Actions from '../actions/actions.js';
// import request from 'superagent';


const HomeDumb = React.createClass({

  render() {
    const {userId} = this.props;
    return (
      <div className="container headerPaddingTop">
        <div className="centreTitle marginUnder">
          <h2>StockDuel</h2>
          <h6>Fantasy Stock Trading</h6>
        </div>
        <div className="container">
          <div className="row six columns">
            <h5>
              1. Join or make a match
            </h5> 
            <h5>
              2. Create a portfolio
            </h5>
            <h5>
              {"3. Beat your opponent's portfolio"}
            </h5>
          </div>
          <div className="row six columns">
            <img className="homeLogo" src="../assets/images/logo.png" alt="stockSuel logo black" />
          </div>
        </div>
        <div className="centreTitle" >
        {!userId && <a href="/auth/facebook"><img className="imgWidth" src='../assets/images/login.png' alt="facebook login button" /></a>}
        </div>

      </div>
    );
  }

});

function mapStateToProps(state) {
  return {
    userId: state.get('userId')
  }
}

//connect and export App
export const Home = connect(mapStateToProps)(HomeDumb);