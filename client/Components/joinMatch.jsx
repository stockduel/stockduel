'use strict';
import React from 'react';
import { render } from 'react-dom';
import request from 'superagent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions.js';

export const JoinMatch = React.createClass({
  componentWillMount() {
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
  // joinMatch(MatchId){
  //   return function() {
  //     request.put('/matches/'+MatchId)
  //     .end(function(err, res) {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         window.location.hash="#/matches";
  //       }
  //     })      
  //   }
  // },


  render() {
    const { joinMatch } = this.props;
    return (
      <div>
        <ul>
          {this.matches && this.matches.map((matchObj) => {
            return matchObj ? <li key={matchObj.m_id} onClick={() => {
              joinMatch(matchObj.m_id);
              window.location.hash="#/portfolio";
              }}>{matchObj.title}</li> : null;
          })}
        </ul>
      </div>
    )
  }
});


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const JoinMatchConnected = connect(null, mapDispatchToProps)(JoinMatch);
