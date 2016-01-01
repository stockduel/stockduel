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
    console.log('here', this.matches)
    return (
      <div className="container paddingTop">
        {errorValue && <div>
          <p>Sorry! Someone already joined that match. Please find a new match to join.</p>
        </div>}
        <ul>
          {this.matches && this.matches.map((matchObj) => {
            return matchObj ? <Card className="paddingTop"><div key={matchObj.m_id} >
              <CardText>
                <h6>Match: {matchObj.title}</h6>  
                <h6>Starts {moment(matchObj.startdate).fromNow()} and ends {moment(matchObj.enddate).fromNow()}</h6> 
                <h6>Match Funds: {'$'+numeral(matchObj.starting_funds).format('0,0')}</h6>
              </CardText>
              <CardActions>
                <FlatButton 
                label="Join Match"
                onClick={() => {
                joinMatch(matchObj.m_id);
              }} />
              </CardActions>
              </div></Card> : null;
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
