'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';

const MatchesList = React.createClass({
  setMatch(m_id) {
    var self = this;
    return function() {
      self.props.setCurrentMatch(m_id);
      window.location.hash='#/portfolio';
    }
  },

  formatMatchDisplay(matchObj) {
    
      if (matchObj.get('type') === 'head') {
        if (matchObj.get('status') === 'complete') {
          let winnerId = matchObj.get('winner');
          let resultMessage = Number(winnerId) === Number(this.props.userId) ? "You won this match" : "You lost this match";
          return resultMessage + " on " + matchObj.get('endDate').substr(0, 10);
        }
        if (matchObj.get('status') === 'active') {
          return "Match in progress . . . End date: " + matchObj.get('enddate').substr(0, 10);
        }
        if (matchObj.get('status') === 'rejected') {
          return "No one joined this match, so it was rejected."
        }
        if (matchObj.get('status') === 'pending') {
          return "Pending start date: " + matchObj.get('startdate').substr(0, 10);
        }
      } else if (matchObj.get('type') === 'solo') {  // solo match: no winner or loser
        return "Solo Match. Start date: " + matchObj.get('startdate').substr(0, 10);
      }
    
  },

  render() {
    const { matches, userId } = this.props; // immutableJS List
    return (
      <div>
        <ul>
          {matches.map(match => {
              return <li key={match.get('m_id')} onClick={this.setMatch(match.get('m_id'))}>{match.get('title')} -- <em>{this.formatMatchDisplay(match)}</em></li>
          })}
        </ul>
      </div>
    );
  }
});

function mapStateToProps(state) {
  console.dir(state.get('matches').toJS());
  return {
    matches: state.get('matches'),
    userId: state.get('userId')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const MatchesConnected = connect(mapStateToProps, mapDispatchToProps)(MatchesList);

