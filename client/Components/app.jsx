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

import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');


let App = React.createClass({

  componentWillMount() {
    this.props.setInitialState(); // get the userId  
  },

  componentDidMount() {
    //this.getUserName(); 
  },

  //this is to try and get the username in the nav bar not working currently
  // getUserName () {
  //   this.username;
  //   var that = this;
  //   request.get('/users/' + this.props.userId)
  //     .end((err, res) => {
  //       if (err) {
  //         console.error(err)
  //       } else {
  //         console.log('data', res.body)
  //         that.username = res.body.data.username;
  //         this.render();
  //       }
  //     });
  // },

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

    const { buy, sell, setCurrentMatch, setInitialState, userId, logout, createMatch, error, clearError, createError } = this.props;

    //the drop down menu available from every page when the user is logged in
    const userButtons = 
    (<ToolbarGroup float="right">
      <IconMenu iconButtonElement={<i className="fa fa-university fa-lg iconMarginTop"></i>} >
        <MenuItem primaryText="Create Match" leftIcon={<i className="fa fa-file-o"></i>} onClick={ ()=>{ window.location.hash="#/create" } } />
        <MenuItem primaryText="My Matches" leftIcon={<i className="fa fa-archive"></i>} onClick={ ()=>{ window.location.hash="#/matches" } } />
        <MenuItem primaryText="Matches to Join" leftIcon={<i className="fa fa-plus"></i>} onClick={ ()=>{ window.location.hash="#/join" } } />
        <Divider />
        <MenuItem primaryText="Sign out" leftIcon={<i className="fa fa-sign-out"></i>} onClick={ ()=>{ logout(); window.location.hash="#/"; } } />
      </IconMenu>

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
