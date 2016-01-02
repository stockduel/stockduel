'use strict';

import React from 'react';
import { render } from 'react-dom';
import { toJS } from 'immutable';
import { createMatch, clearError, createError } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { connect } from 'react-redux';

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

  componentWillMount() {
    this.props.clearError();
  },

  render() {
    let start, end, matchTitle, dStart, dEnd, yearStart, monthStart, dateStart, dateIntegerStart;
    let dateFormatStart, yearEnd, monthEnd, dateEnd, dateIntegerEnd, dateFormatEnd, matchType;

    const { userId, createMatch, errorValue, createError, clearError } = this.props;
    let startFunds = '10000';
    let menuItems = [
      { payload: '10000', text: '$10,000' },
      { payload: '50000', text: '$50,000' },
      { payload: '100000', text: '$100,000' },
      { payload: '500000', text: '$500,000' },
      { payload: '1000000', text: '$1,000,000' }

    ];

    return (
      <div className="container paddingTop">
        
        <h3 className="centreTitle headerPadCreateMatch container">Create a Match</h3>

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
                 matchType;
                 start = this.refs.startDate.value;
                 end = this.refs.finishDate.value;
                 matchTitle = this.refs.matchTitleInput.refs.input.value;
                 if (this.refs.headOrSolo.refs.head.isChecked()) {
                   matchType = 'head';
                 } else if (this.refs.headOrSolo.refs.solo.isChecked()) {
                   matchType = 'solo';
                 }

                 dStart = start.split('-');
                 dEnd = end.split('-');
         
                 yearStart = dStart[0];
                 monthStart = dStart[1]-1;
                 dateStart = dStart[2];
                 dateIntegerStart = Date.UTC(yearStart,monthStart,dateStart, 14);
                 dateFormatStart = new Date(dateIntegerStart);
         
                 yearEnd = dEnd[0];
                 monthEnd = dEnd[1]-1;
                 dateEnd = dEnd[2];
                 dateIntegerEnd = Date.UTC(yearEnd,monthEnd,dateEnd, 14);
                 let today = new Date(Date.now());
                 today = new Date(today.setHours(0));
                 today = today.setMinutes(0);
                 dateFormatEnd = new Date(dateIntegerEnd);
                 if (dateIntegerStart < today || dateIntegerStart > dateIntegerEnd || !matchType || !matchTitle || !startFunds || !dateIntegerStart || !dateIntegerEnd) {
                   return createError();
                   // alert('Please pick an option for every field')
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
                         
              }} />
            </div>

            {errorValue && <div className="error">
              { 
                (dateIntegerStart < Date.now() || dateIntegerStart > dateIntegerEnd) ?
                  <p>Make sure your start date is before your end date.</p> :
                    <p>Please enter a value for all fields</p>
              }
            </div>}
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
  return bindActionCreators({createMatch, clearError, createError}, dispatch);
}

//connect and export App
export const CreateMatchConnected = connect(mapStateToProps, mapDispatchToProps)(CreateMatch);

