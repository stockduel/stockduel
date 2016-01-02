'use strict';
//import action creators & connect for app since it's connected
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import standard react functions
import React from 'react';
import { render } from 'react-dom';
//import the two actions needed for the app
import { logout, setInitialState } from '../actions/actions.js';
//import router functionality
import { Link } from 'react-router';

//import material UI components
import RaisedButton from 'material-ui/lib/raised-button';
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
const Toolbar = require('material-ui/lib/toolbar/toolbar');
const ToolbarTitle = require('material-ui/lib/toolbar/toolbar-title');
const ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');

//declare app
let App = React.createClass({

  // call to set initial state when the page will mount to get the userId  
  componentWillMount() {
    this.props.setInitialState(); 
  },
  
  render() {
    //import logout action and userId from state
    const { logout, userId } = this.props;

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

//provide userId to the app (nav bar) to be used in determining what to display
function mapStateToProps(state) {
  return {
    userId: state.get('userId')
  };
}

//map the two actions needed for this page to props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({logout, setInitialState}, dispatch);
}

//connect and export App
export const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);
