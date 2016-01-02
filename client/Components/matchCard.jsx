import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import request from 'superagent';
// import { BarGraph } from './barGraph.jsx';
import { OpponentGauge } from './opponentGauge.jsx';
import { SoloGauge } from './soloGauge.jsx';

const moment = require('moment');
const numeral = require('numeral');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const FlatButton = require('material-ui/lib/flat-button');

export const MatchCard = React.createClass({

  //get the opponents details from the database and make available to the component
  componentWillMount() {
    this.opponentId = (this.props.match.get('challengee')) === (this.props.userId) ?  (this.props.match.get('creator_id')) : (this.props.match.get('challengee'));
    request.get('/users/' + this.opponentId)
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.opponent = res.body.data.username;
          // render if AJAX call that sets this.opponentPortfolio has already returned
          if (this.opponentPortfolio) {console.log('in first one');
            this.render();
          }
        }
      });
    request.get('/trades/' + this.props.match.get('m_id') + '/' + this.opponentId)
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.opponentPortfolio = res.body.data;
          // render if AJAX call that sets this.opponent has already returned
          if (this.opponentPortfolio) { console.log('in second one');
            this.render();
          }        
        }
      })
  },

  //capitalize the first letter in a passed in word
  capFirstLetter (matchTitle) {
    return matchTitle.charAt(0).toUpperCase() + matchTitle.slice(1);
  },

  //returns a matchInfo object wih your portfolio value and your opponents
  getMatchInfo(){
    let matchInfo = {};
    matchInfo['You'] = Number(this.props.match.getIn(['portfolio', 'totalValue'])).toFixed(2);
    matchInfo[this.opponent] = this.opponentPortfolio &&  Number(this.opponentPortfolio.totalValue).toFixed(2);
    return matchInfo;
  },

  render() {
    const {match, setMatch} = this.props;

    //decided not to use currently as gauge shows this visually
    // let forHeadToHead = (<div>
    //                       <p>Opponent: {this.opponentPortfolio && "$" + numeral(Number(this.opponentPortfolio.totalValue).toFixed(2)).format('0,0')}</p>
    //                     </div>);
    
    //variables to allow times to be compared
    let startDate = match.get('startdate');
    let start = moment(startDate).fromNow();
    let endDate = match.get('enddate');
    let end = moment(endDate).fromNow();

    let winner = null;

    if (match.get('status') === 'complete') {
       //if the match is a head to head the work out who was the winner
      if (match.get('type') === 'head') {
        if (match.get('winner') === this.opponentId) {
          winner = <p className="error">You Lost</p>;
        } else if (match.get('winner') !== null) {
          winner = <p className="win">You Won!</p>;
        } else {
          winner = <p>Tie</p>;
        }
      }
    }

    let type = null;
    //format and render the status in the card
    if (match.get('type') === 'head') {
      type = 'Head to Head';
    } else {
      type = 'Solo';
    }

    return (
      <div className="paddingTop container listMatchCards">

        <Card>

          <CardText>

            <div className="row">
              <div className="four columns">
                <p className="font titleSizeCard" >{this.capFirstLetter(match.get('title'))}</p>
              </div>
              <div className="four columns titleSizeCard">
                {winner}
              </div>

              <div className="rightButton paddingTopLess">
                <FlatButton hoverColor="#009ACD" label="Go to portfolio"
                  linkButton={true} onClick={setMatch} />
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <hr style={{marginTop:'-14px'}} />
              </div>
            </div>

            <div className="row">
            
              <div className="four columns">
                <p>{type}</p>
                <p>Start: {start}</p>
                <p>Opponent: {this.opponent || "none"} </p>
              </div>
              <div className="four columns">
                <p>Your Portfolio: {'$' + numeral(Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)).format('0,0')}</p>
                <p>End: {end}</p>
                <p>{this.opponent && this.opponent + "'s Portfolio: "}{this.opponentPortfolio && "$" + numeral(Number(this.opponentPortfolio.totalValue).toFixed(2)).format('0, 0')}</p>
              </div>

              <div className="four columns">
                {/*logic to decide which type of gauge to display*/}
                {this.opponentPortfolio ? <OpponentGauge portfolio={Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)} opponentPortfolio={this.opponentPortfolio.totalValue.toFixed(2)} /> : 
                  <SoloGauge matchFunds={match.get('starting_funds')} portfolio={Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)} /> 
                }
              </div>

            </div>

          </CardText>

        </Card>

      </div>
    );
  }
});

