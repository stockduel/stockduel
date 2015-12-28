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

  render() {
    const { matches } = this.props; // immutableJS List
    return (
      <div>
        <ul>
          {matches.map(match => {
              return <li key={match.get('m_id')} onClick={this.setMatch(match.get('m_id'))}>{match.get('title')}</li>
          })}
        </ul>
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    matches: state.get('matches')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const MatchesConnected = connect(mapStateToProps, mapDispatchToProps)(MatchesList);

