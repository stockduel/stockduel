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
const FlatButton = require('material-ui/lib/flat-button');
const TextField = require('material-ui/lib/text-field');

export const CreateMatchDumb = React.createClass({

  render() {

    const { userId, createMatch } = this.props;
    let startFunds;

    return (
      <div className="container paddingTop">
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
                <DropDownMenu value={1} onChange={function (event, index, menuItem) {
                    startFunds = menuItem;
                  }}>
                  <MenuItem value={1} primaryText="Choose Here"/>
                  <MenuItem value={10000} primaryText="$10,000"/>
                  <MenuItem value={50000} primaryText="$50,000"/>
                  <MenuItem value={100000} primaryText="$100,000"/>
                  <MenuItem value={1000000} primaryText="$1,000,000"/>
                </DropDownMenu>

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


      </div>
    );
  }

});
