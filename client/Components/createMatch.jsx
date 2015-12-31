'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';
import { createMatch } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const DatePicker = require('material-ui/lib/date-picker/date-picker');
const DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');
const Checkbox = require('material-ui/lib/checkbox');
const RadioButton = require('material-ui/lib/radio-button');
const RadioButtonGroup = require('material-ui/lib/radio-button-group');
const Toggle = require('material-ui/lib/toggle');
const DropDownMenu = require('material-ui/lib/drop-down-menu');
const Dialog = require('material-ui/lib/dialog');
const RaisedButton = require('material-ui/lib/raised-button');
const Card = require('material-ui/lib/card/card');
const CardActions = require('material-ui/lib/card/card-actions');
const CardExpandable = require('material-ui/lib/card/card-expandable');
const CardHeader = require('material-ui/lib/card/card-header');
const CardMedia = require('material-ui/lib/card/card-media');
const CardText = require('material-ui/lib/card/card-text');
const CardTitle = require('material-ui/lib/card/card-title');
const Avatar = require('material-ui/lib/avatar.js');
const TextField = require('material-ui/lib/text-field');

export const CreateMatchDumb = React.createClass({

  render() {

    let matchType;
    let startFunds;
    let matchTitle;
    const { userId, createMatch } = this.props;

    let menuItems = [
      { payload: '1', text: '' },
      { payload: '50000', text: '$50,000' },
      { payload: '100000', text: '$100,000' },
      { payload: '500000', text: '$500,000' },
      { payload: '1000000', text: '$1,000,000' }
    ];

    return (
      <div className="container paddingTop">

        <Card initiallyExpanded={false}>
          <CardHeader
            title="Create Match"
            actAsExpander={true}
            showExpandableButton={true}>
          </CardHeader>

          <CardText expandable={true}>

          <div className="row container">
             <div className="spaceUnder">
               <TextField onChange={function ()  {
                 matchTitle = arguments[0].target.value;
               }}
                 hintText="Match Title" className="matchTitleBox" />
             </div>
          </div>

          <div className="row container">
            <div className="four columns">
               <h5>Start Date:</h5>
               <input className="datePicker" type="date" name="start" id="startDate" />
                <h5>Finish Date:</h5>
               <input className="datePicker" type="date" name="finish" id="finishDate" />
            </div>

            <div className="four columns">
              <h5>Type of Match:</h5>
              <RadioButtonGroup name="shipSpeed" defaultSelected="light"
                onChange={function (change, event) {
                  matchType = event;
                }}>
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

            <div className="three columns">
              <h5>Start Funds:</h5>
                <DropDownMenu menuItems={menuItems} 
                  onChange={function (event, index, menuItem) {
                    startFunds = menuItem.payload;
                  }} />
            </div>

           </div>

          </CardText>

          <CardActions expandable={true}>
           <div className='rightButton'>
              
              <RaisedButton label="Submit"
               
               linkButton={true} onClick={function(){ 
                 //date values
                 let start = document.getElementById('startDate').value;
                 let end = document.getElementById('finishDate').value;

                 //time formats
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
                     if (!matchType || !matchTitle || !startFunds || !dateIntegerStart || !dateIntegerEnd) {
                       alert('Please pick an option for every field')
                     } else {
                       let createOptions = {
                         userId: userId,
                         title: matchTitle,
                         startdate: dateFormatStart,
                         enddate: dateFormatEnd,
                         startFunds: startFunds,
                         type: matchType === "solo" ? "solo" : "head"
                       };
                      createMatch(createOptions); 
                     }
                   }
              
                 }

             }} />

           </div>
          </CardActions>

        </Card>



      </div>
    );
  }

});

function mapStateToProps(state) {
  
  return {
    userId: state.get('userId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({createMatch}, dispatch);
}

export const CreateMatch = connect(mapStateToProps, mapDispatchToProps)(CreateMatchDumb);
