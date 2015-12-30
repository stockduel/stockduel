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

    let forHeadToHead = (<div>
                          <p>Challenger: {this.challengee}</p>
                          <p>Portfolio: {this.challengeePortfolio && "$" + Number(this.challengeePortfolio.totalValue).toFixed(2)}</p>
                        </div>);

    // let startDate = match.get('startdate');
    // let start = moment(startDate).format("MMM Do YYYY");
    // let endDate = match.get('enddate');
    // let end = moment(endDate).format("MMM Do YYYY");

    return (
      <div className="container paddingTop">

        <Card initiallyExpanded={false}>
          <CardHeader
            title={match.get('title')}
            subtitle={match.get('status')}
            actAsExpander={true}
            showExpandableButton={true}>
          </CardHeader>

          <CardText expandable={true}>

          <div className="row container">
            <p>Type: {match.get('type')}</p>
            <p>Start: {match.get('startdate')}</p>
            <p>End: {match.get('enddate')}</p>
          </div>

          <div className="player1 container">
            <div>
              <p>Your Portfolio: {'$' + Number(match.getIn(['portfolio', 'totalValue'])).toFixed(2)}</p>
            </div>
          </div>

          <div className="player2 container">
            { match.get('type') === 'head' ? forHeadToHead : null }
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
