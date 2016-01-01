'use strict';
import React from 'react';
import { render } from 'react-dom';
import request from 'superagent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions.js';
const moment = require('moment');
const numeral = require('numeral');

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const FlatButton = require('material-ui/lib/flat-button');

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

  capFirstLetter (matchTitle) {
    return matchTitle.charAt(0).toUpperCase() + matchTitle.slice(1);
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
      <div className="container headerPadCreateMatch">

        <h2 className="centreTitle">Matches to Join</h2>
        {errorValue && <div>
          <p>Sorry! Someone already joined that match. Please find a new match to join.</p>
        </div>}
        
        <table className="u-full-width paddingTop">
          <thead>
            <tr>
              <th>Match</th>
              <th>Funds</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th style={{color:"white"}}>Button</th>
            </tr>
          </thead>
          <tbody>
            {this.matches && this.matches.map((matchObj) => {
              return matchObj ? <tr><div key={matchObj.m_id}>
                <td>{this.capFirstLetter(matchObj.title)}</td>
                <td>{numeral(matchObj.starting_funds).format('0,0')}</td>
                <td>{moment(matchObj.startdate).fromNow()}</td>
                <td>{moment(matchObj.enddate).fromNow()}</td>
                <td><FlatButton hoverColor="#009ACD" label="Join" onClick={() => {
                  joinMatch(matchObj.m_id);
                }} />
                </td>
              </div></tr> : null;
            })}
          </tbody>
        </table>

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
