'use strict';
import { bindActionCreators } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import * as Actions from '../actions/actions.js';
import { MatchCard } from './matchCard.jsx';
import { CreateMatchDumb } from './createMatch.jsx';

//Material UI styles
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';

const MatchesList = React.createClass({

  componentWillMount() {
    this.props.clearError();
  },

  //trigger an action to set the current match id and re-render
  setMatch(m_id) {
    var self = this;
    return function() {
      self.props.setCurrentMatch(m_id);
      window.location.hash='#/portfolio';
    }
  },

  //Deprecated
  // formatMatchDisplay(matchObj) {
  //     if (matchObj.get('type') === 'head') {
  //       if (matchObj.get('status') === 'complete') {
  //         let winnerId = matchObj.get('winner');
  //         let resultMessage = Number(winnerId) === Number(this.props.userId) ? "You won this match" : "You lost this match";
  //         return resultMessage + " on " + matchObj.get('endDate').substr(0, 10);
  //       }
  //       if (matchObj.get('status') === 'active') {
  //         return "Match in progress . . . End date: " + matchObj.get('enddate').substr(0, 10);
  //       }
  //       if (matchObj.get('status') === 'rejected') {
  //         return "No one joined this match, so it was rejected."
  //       }
  //       if (matchObj.get('status') === 'pending') {
  //         return "Pending start date: " + matchObj.get('startdate').substr(0, 10);
  //       }
  //     } else if (matchObj.get('type') === 'solo') {  // solo match: no winner or loser
  //       return "Solo Match. Start date: " + matchObj.get('startdate').substr(0, 10);
  //     }
  // },
//
  render() {
    const { matches, userId, createMatch } = this.props;
    console.log('matches', matches.toJS())

    //logic to display message and button to creat match if you have not yet made a match
    let noMatches;
    if ( (matches.count() ===1 && matches.get('m_id') === "") || matches.count() === 0) {
      noMatches = (<div className="centreTitle headerPaddingTop" ><h3>You have no matches yet</h3><RaisedButton label="Create Match" link={true} href='/#/create' /></div>);
    }

    return (
      <div>

        <Tabs primary={true}
          onChange={this.handleChange}
          inkBarStyle={{
            backgroundColor:'#009ACD'
          }}
          >
        {/*tab one current matches*/}
          <Tab style={{background:'white', fontSize:'15px', color: "#484848"}} label="Current Matches" value="a" >
            <div className="container">

            {noMatches}

              <ul>
                {matches.map((match,index) => { 
                  if (match.get('status') === "active") {
                    //require the match card component
                    return (<MatchCard key={index} setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>);
                   }
                })}
              </ul>

            </div>
          </Tab>

          {/*tab two pending matches*/}
          <Tab style={{background:'white', fontSize:'15px', color: "#484848"}} label="Pending Matches" value="b">
            <div className="container">
              
              {noMatches}

              <ul>
                {matches.map( (match,index) => {
                  if (match.get('status') === "pending") {
                    return <MatchCard key={index} setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>
                  }
                })}
              </ul>

            </div>
          </Tab>

        {/*tab three complete matches*/}
          <Tab style={{background:'white', fontSize:'15px', color: "#484848"}} label="Past Matches" value="c">
            <div className="container">

              {noMatches}

              <ul>
                {matches.map((match,index) => {
                  if (match.get('status') === "complete") {
                    return <MatchCard key={index} setMatch={this.setMatch(match.get('m_id'))} match={match} userId={userId}/>
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

//map state to props
function mapStateToProps(state) {
  //pass just the matches and user id to this component
  return {
    matches: state.get('matches'),
    userId: state.get('userId')
  };
}

//bind the actions to the component so the methods can be passed to the props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//connect and export JoinMatch
export const MatchesConnected = connect(mapStateToProps, mapDispatchToProps)(MatchesList);

