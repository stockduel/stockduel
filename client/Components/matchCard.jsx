import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import request from 'superagent';
import { BarGraph } from './barGraph.jsx';

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
const RaisedButton = require('material-ui/lib/raised-button');

export const MatchCard = React.createClass({

  componentWillMount() {
    let opponentId = (this.props.match.get('challengee')) === (this.props.userId) ?  (this.props.match.get('creator_id')) : (this.props.match.get('challengee'));
    request.get('/users/' + opponentId)
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.opponent = res.body.data.username;
          window.location.hash="#/matches";
        }
      });
    request.get('/trades/' + this.props.match.get('m_id') + '/' + opponentId)
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.opponentPortfolio = res.body.data;
          window.location.hash="#/matches";
        }
      })
  },

  getMatchInfo(){
    let matchInfo = {};
    matchInfo['You'] = Number(this.props.match.getIn(['portfolio', 'totalValue'])).toFixed(2);
    matchInfo[this.opponent] = this.opponentPortfolio &&  Number(this.opponentPortfolio.totalValue).toFixed(2);
    return matchInfo;
  },

  render() {
    const {match, setMatch} = this.props;

    let forHeadToHead = (<div>
                          <p>Opponent: {this.opponent}</p>
                          <p>Portfolio: {this.opponentPortfolio && "$" + numeral(Number(this.opponentPortfolio.totalValue).toFixed(2)).format('0,0')}</p>
                        </div>);

    let startDate = match.get('startdate');
    let start = moment(startDate).fromNow();
    let endDate = match.get('enddate');
    let end = moment(endDate).fromNow();

    return (
      <div className="paddingTop container listMatchCards">

        <Card initiallyExpanded={false}>
          <CardHeader
            title={match.get('title')}
            subtitle={match.get('status')}
            actAsExpander={true}
            showExpandableButton={true}>
          </CardHeader>

          <CardText expandable={true}>
          <hr style={{marginTop:'-14px'}} />
          <div className="row">
            <div className="four columns paddingTopStocks">
              <p>Type: {match.get('type')}</p>
              <p>Start: {start}</p>
              <p>End: {end}</p>
              <p>Your Portfolio: {'$' + numeral(Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)).format('0,0')}</p>
              { match.get('type') === 'head' ? forHeadToHead : null }
            </div>
            
            <div className="eight columns">
              { this.opponentPortfolio ? <BarGraph match={ this.getMatchInfo() }/> : <div></div> }
            </div>
          </div>

          </CardText>

          <CardActions expandable={true}>
           <div className='rightButton'>
              
              <RaisedButton label="Go to portfolio"
               linkButton={true} onClick={setMatch} />

           </div>
          </CardActions>  

        </Card>

      </div>
    );
  }
});
