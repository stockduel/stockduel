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

const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');


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

  componentWillMount() {
      this.props.setInitialState(); // get the userId  
  },
  
  render() {

    const { buy, sell, setCurrentMatch, setInitialState, userId, logout } = this.props;

    const userButtons = 
    (<ToolbarGroup float="right">
      <button className="navButton"><Link className="navButtonFontSize" to="/matches">My Matches</Link></button> 
      <button className="navButton"><Link className="navButtonFontSize" to="/create">Create Match</Link></button>
      <button className="navButton"><Link className="navButtonFontSize" to="/join">Matches To Join</Link></button>
      <button className="navButton"><Link className="navButtonFontSize" to="/search">Search</Link></button>
      <button className="navButton" onClick={()=>{logout()}}><Link className="navButtonFontSize" to="/#">Logout</Link></button>
    </ToolbarGroup>);

    return (
      <div>
      <Toolbar
          style={{backgroundImage: 'url('+'http://hypertext.net/images/weblog/linen-backgrounds/dark_linen-640x960.png'+')', height:'60px'}}>
          <ToolbarGroup float="left" className="logoTopPad"><Link className="navButtonFontSize" to="/"><img className="navLogo" src='../assets/images/whiteLogo.png' alt="stockduel white logo" /></Link></ToolbarGroup>
          { !!userId ? userButtons : null }
        </Toolbar>

      </div>
    )
  }
});

//map state to props
function mapStateToProps(state) {
  return state.toJS();
}

//map dispatch to props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//connect and export App
export const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);
