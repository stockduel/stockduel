'use strict'

import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { setInitialState } from '../actions/actions.js';

//page to fill space while facebook authenticates the user
const StateGen = React.createClass({

  componentWillMount() {
      this.props.setInitialState(); // get the userId  
  },

  render() {
    return (
      <div>
        <h3>Getting your info . . .</h3>
      </div>
    );
  }

});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setInitialState}, dispatch);
}

export const StateGenConnected = connect(null, mapDispatchToProps)(StateGen);
