'use strict';
import React from 'react';
import { render } from 'react-dom';
import request from 'superagent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions.js';

export const JoinMatch = React.createClass({

  componentWillMount() { 
    this.props.clearError();
    window.localStorage.setItem('joinMatchError', null); // joinMatchError has done its job and dictated state's error field. Time to clear the stale error
    
    var self = this;
    request.get('/matches/')
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          self.matches = res.body.data;
          window.location.hash = "#/join";
        }
      })
  },
  // same functionality on update and willMount
  componentWillUpdate() {
    if (window.localStorage.getItem('joinMatchError') !== "null") { // local storage converts null to "null"
      var self = this;
      request.get('/matches/')
        .end(function(err, res) {
          if (err) {
            console.error(err);
          } else {
            self.matches = res.body.data;
            window.localStorage.setItem('joinMatchError', null); 
            window.location.hash = "#/join";
          }
      })
    }
        
  },

  render() {
    const { joinMatch, userId, createMatch, errorValue } = this.props;
    return (
      <div>
        {errorValue && <div>
          <p>Sorry! Someone already joined that match. Please find a new match to join.</p>
        </div>}
        <ul>
          {this.matches && this.matches.map((matchObj) => {
            return matchObj ? <li key={matchObj.m_id} onClick={() => {
              joinMatch(matchObj.m_id);
              }}>{matchObj.title}</li> : null;
          })}
        </ul>
      </div>
    )
  }
});

function mapStateToProps(state) {  
  return {
    userId: state.get('userId'),
    errorValue: state.get('error')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const JoinMatchConnected = connect(mapStateToProps, mapDispatchToProps)(JoinMatch);
