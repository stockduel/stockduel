'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';
import { MatchCard } from './matchCard.jsx';
import { CreateMatchDumb } from './createMatch.jsx';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';


const MatchesList = React.createClass({

  setMatch(m_id) {
    var self = this;
    return function() {
      self.props.setCurrentMatch(m_id);
      window.location.hash='#/portfolio';
    }
  },

  handleChange(value) {
     this.setState({
       value: value,
     });
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
    const { matches, userId, createMatch } = this.props;

    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    };

    return (
      <div>

        <Tabs primary={true}
          onChange={this.handleChange}>

          <Tab style={{background:'#009ACD', fontSize:'15px'}} label="Current" value="a" >
            <div className="container">
              <h2 className="centreTitle" style={styles.headline} >Current Matches</h2>
              <CreateMatchDumb userId={userId} createMatch={createMatch} />

              <ul>
                {matches.map(match => { 
                  if (match.get('status') === "active") {
                     return (<MatchCard setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>);
                   }
                })}
              </ul>

            </div>
          </Tab>

          <Tab style={{background:'#009ACD', fontSize:'15px'}} label="Pending" value="b">
            <div className="container">
              <h2 className="centreTitle" style={styles.headline}>Pending Matches</h2>
              <CreateMatchDumb userId={userId} createMatch={createMatch} />

              <ul>
                {matches.map(match => {
                  if (match.get('status') === "pending") {
                    return <MatchCard setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>
                  }
                })}
              </ul>

            </div>
          </Tab>

          <Tab style={{background:'#009ACD', fontSize:'15px'}} label="Past" value="c">
            <div className="container">
              <h2 className="centreTitle" style={styles.headline}>Past Matches</h2>
              <CreateMatchDumb userId={userId} createMatch={createMatch} />

              <ul>
                {matches.map(match => {
                  if (match.get('status') === "complete") {
                    return <MatchCard setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>
                  }
                })}
              </ul>
              
            </div>
          </Tab>

        </Tabs>

      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    matches: state.get('matches'),
    userId: state.get('userId')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export const MatchesConnected = connect(mapStateToProps, mapDispatchToProps)(MatchesList);

