'use strict';
import React from 'react';
import { render } from 'react-dom';
import request from 'superagent';

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
  joinMatch(matchId){
    return function() {
      request.put('/matches/'+matchId)
      .end(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          window.location.hash="#/matches";
        }
      })      
    }
  },


  render() {
    return (
      <div>
        <ul>
          {!this.matches ? null : this.matches.map((matchObj) => {
            return matchObj ? <li key={matchObj.m_id} onClick={this.joinMatch(matchObj.m_id)}>{matchObj.title}</li> : null;
          })}
        </ul>
      </div>
    )
  }
});
