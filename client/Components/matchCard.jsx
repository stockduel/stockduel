import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import request from 'superagent';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const RaisedButton = require('material-ui/lib/raised-button');

export const MatchCard = React.createClass({
  componentWillMount() {
    request.get('/users/' + this.props.match.get('challengee'))
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.challengee = res.body.data.username;
          window.location.hash="#/matches";
        }
      });
    request.get('/trades/' + this.props.match.get('m_id') + '/' + this.props.match.get('challengee'))
      .end((err, res) => {
        if (err) {
          console.error(err)
        } else {
          this.challengeePortfolio = res.body.data;
          window.location.hash="#/matches";
        }
      })
  },
  render() {
    const {match, setMatch} = this.props;
    return (
      <div className="container paddingTop">

        <Card initiallyExpanded={false}>
          <CardHeader
            title={match.get('title')}
            actAsExpander={true}
            showExpandableButton={true}>
          </CardHeader>

          <CardText expandable={true}>

          <div className="row container">
            <p>Status: {match.get('status')}</p>
            <p>Start: {match.get('startdate')}</p>
            <p>End: {match.get('enddate')}</p>
          </div>

          <div className="row container player1">
            <div className="six columns">
              <p>You</p>
              <p>Portfolio: {'$' + Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)}</p>
            </div>
            <div className="six columns">
              <p>Challenger: {this.challengee}</p>
              <p>Portfolio: {this.challengeePortfolio && "$" + Number(this.challengeePortfolio.totalValue).toFixed(2)}</p>
            </div>
          </div>

          <div className="row container player2">
            
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
