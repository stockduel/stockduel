'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { createMatch } from '../actions/actions.js';
import { bindActionCreators } from 'redux';

import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const RadioButton = require('material-ui/lib/radio-button');
const RadioButtonGroup = require('material-ui/lib/radio-button-group');
const Toggle = require('material-ui/lib/toggle');
const TextField = require('material-ui/lib/text-field');
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

export const CreateMatch = React.createClass({

  render() {

    const { userId, createMatch } = this.props;
    let startFunds;
    let menuItems = [
      { payload: '10000', text: '$10,000' },
      { payload: '50000', text: '$50,000' },
      { payload: '100000', text: '$100,000' },
      { payload: '500000', text: '$500,000' },
      { payload: '1000000', text: '$1,000,000' }

    ];

    return (
      <div className="container paddingTop">
        
        <h3 className="centreTitle headerPadCreateMatch">Create a Match</h3>

        <Card className="container">
          <CardText>
            <div className="row">
               <div className="spaceUnder">
                 <TextField ref="matchTitleInput"
                   hintText="Match Title" className="matchTitleBox" />
               </div>
            </div>

            <div className="row">
              <div className="four columns">
                 <h5>Start Date:</h5>
                 <input className="datePicker" type="date" name="start" ref="startDate" />
                  <h5>Finish Date:</h5>
                 <input className="datePicker" type="date" name="finish" ref="finishDate" />
              </div>

              <div className="four columns">
                <h5>Type of Match:</h5>
                <RadioButtonGroup ref="headOrSolo" name="shipSpeed" defaultSelected="light">
                   <RadioButton
                     value="solo"
                     label="Solo"
                     style={{marginBottom:16}} />
                   <RadioButton
                     value="head"
                     label="Head-To-Head"
                     style={{marginBottom:16}}/>
                </RadioButtonGroup>
              </div>

             <div className="four columns">
               <h5>Start Funds:</h5>
                 <DropDownMenu menuItems={menuItems} 
                   onChange={function (event, index, menuItem) {
                     startFunds = menuItem.payload;
                   }} />
             </div>

             </div>
             <div className="rightButton">
               <FlatButton label="Submit"
                secondary={true}
                linkButton={true} onClick={ () => { 
                   let matchType;
                   let start = this.refs.startDate.value;
                   let end = this.refs.finishDate.value;
                   let matchTitle = this.refs.matchTitleInput.refs.input.value;
                   if (this.refs.headOrSolo.refs.head.isChecked()) {
                     matchType = 'head';
                   } else if (this.refs.headOrSolo.refs.solo.isChecked()) {
                     matchType = 'solo';
                   }

                   let dStart = start.split('-');
                   let dEnd = end.split('-');
               
                   let yearStart = dStart[0];
                   let monthStart = dStart[1]-1;
                   let dateStart = dStart[2];
                   let dateIntegerStart = Date.UTC(yearStart,monthStart,dateStart, 14);
                   let dateFormatStart = new Date(dateIntegerStart);
               
                   let yearEnd = dEnd[0];
                   let monthEnd = dEnd[1]-1;
                   let dateEnd = dEnd[2];
                   let dateIntegerEnd = Date.UTC(yearEnd,monthEnd,dateEnd, 14);
                   let dateFormatEnd = new Date(dateIntegerEnd);
               
                   if (dateFormatStart.toString().substr(0, 3) === 'Sun' || dateFormatStart.toString().substr(0, 3) === 'Sat' ) {
               
                     return alert('Stock market\'s not open on '+dateFormatStart.toString().substr(0,3) + 'day.');
                   
                   } else {
               
                     if (dateIntegerStart < Date.now() || dateIntegerStart > dateIntegerEnd) {
                       alert('Matches should not start before today, and should not end before they start.');
                     } else {
                       if (!matchType || !matchTitle || !dateIntegerStart || !dateIntegerEnd) {
                        console.log(matchType, matchTitle,startFunds,dateIntegerStart,dateIntegerEnd)
                         alert('Please pick an option for every field')
                       } else {
                         let createOptions = {
                           userId: userId,
                           title: matchTitle,
                           startdate: dateFormatStart,
                           enddate: dateFormatEnd,
                           startFunds: startFunds || '10000',
                           type: matchType === "solo" ? "solo" : "head"
                         };
                        createMatch(createOptions); 
                       }
                     }
                   }
                   
                }} />
              </div>
          </CardText>
        </Card>
      </div>
    );
  }

});

//map state to props
function mapStateToProps(state) {  
  return {
    userId: state.get('userId'),
    errorValue: state.get('error')
  };
}

//map dispatch to props
function mapDispatchToProps(dispatch) {
  return bindActionCreators({createMatch}, dispatch);
}

//connect and export App
export const CreateMatchConnected = connect(mapStateToProps, mapDispatchToProps)(CreateMatch);

