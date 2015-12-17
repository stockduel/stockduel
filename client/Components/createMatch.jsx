'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

export const CreateMatch = React.createClass({

  render() {
    const { userID, createMatch } = this.props;
    
    return (
      <div>
       <h4>You do not have any matches</h4> 
           <button onClick={() => {
             let createOptions = {
               userID: this.props.userID
             }
             createMatch(createOptions); // triggers action creator in actions.js
           }}>Create a New Match</button>
      </div>
    );
  }

});