'use strict';
import React from 'react';
import { render } from 'react-dom';
import request from 'superagent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/actions.js';

//for number and date formatting
const moment = require('moment');
const numeral = require('numeral');

//Material UI styling variables
const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const FlatButton = require('material-ui/lib/flat-button');

export const JoinMatch = React.createClass({

  //query the databse for joinable match information
  //set a joinMatchError property to null/ back to null
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

  //capitalize the first letter of string
  capFirstLetter (matchTitle) {
    return matchTitle.charAt(0).toUpperCase() + matchTitle.slice(1);
  },

  //if the state does not contain a joinMatchError(that the match is no longer available to be joined) 
  //send a request to the database to get the match information for all matches that can be joined
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

        {/*throw error if the state holds an error value*/}
        <h2 className="centreTitle">Matches to Join</h2>
        {errorValue && <div className="error">
          <p>Sorry! Someone already joined that match. Please find a new match to join.</p>
        </div>}

        {/*table headers*/}
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
            {/*maps the match details to the join matches table if no matches to join dont map any*/}
            {this.matches && this.matches.sort(function(a, b) {
              return a.startdate - b.startdate;
            }).map((matchObj) => {
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

//map the state to props
function mapStateToProps(state) {  
  return {
    userId: state.get('userId'),
    errorValue: state.get('error')
  };
}

//bind the actions to the component so the methods can be passed to the props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//connect and export JoinMatch
export const JoinMatchConnected = connect(mapStateToProps, mapDispatchToProps)(JoinMatch);
