'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { Stock } from './stockCard.jsx';
import { StockPurchase } from './stockPurchaseWidget.jsx';
import * as Actions from '../actions/actions.js';
import { Link } from 'react-router';
import request from 'superagent';

const FlatButton = require('material-ui/lib/flat-button');
const AppBar = require('material-ui/lib/app-bar');
const IconButton = require('material-ui/lib/icon-button');
const NavigationClose = require('material-ui/lib/svg-icons/navigation/close');

let App = React.createClass({
  logIn() {
    request.get('/auth/facebook')
      .end(function(err, res) {
        /* 
        We never enter this callback.
        Goes to Facebook, redirects to /loggedIn which redirects to / (root).
        */
      })
  },
  render() {
    const { buy, sell, updatePrices, setCurrentMatch, setInitialState, userID } = this.props;
    return (
      <div>
       <AppBar
          title={<span>This. Is. StockDuel.</span>}
          iconElementRight={<FlatButton linkButton={true} href="/auth/facebook" label="Login" primary={true} />} />
        <Link to="/home">to home</Link><br/>
        <Link to="/portfolio">to portfolio</Link>
      </div>
    )
  }
});

//map state to props
function mapStateToProps(state) {
  /*  
    Loop through matches until matchId === currentMatchId
    This reveals only the current match's portfolio to the Portfolio component
  */
  return state.toJS();
}

//map dispatch to props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//connect and export App
export const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);
