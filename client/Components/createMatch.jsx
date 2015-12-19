'use strict';

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { toJS } from 'immutable';

// ============== BUGS IN MATERIAL UI V 0.13.4 -- WILL NOT DISPLAY CALENDAR ================ \\
// const DatePicker = require('material-ui/lib/date-picker/date-picker');
// const DatePickerDialog = require('material-ui/lib/date-picker/date-picker-dialog');

export const CreateMatch = React.createClass({

  render() {
    const { userID, createMatch } = this.props;

    return (
      <div>
       <h2>Create a new match!</h2>

       <h3>Match Type</h3> 
       <select id="matchTypeInput">
          <option>Solo</option>
          <option>Head-to-Head</option>
       </select>

       <h3>Starting Funds</h3> 
       <select id="startFundsInput">
          <option>$100,000</option>
          <option>$500,000</option>
          <option>$1,000,000</option>
       </select>

       <h3>Start Date</h3>
       <p>Year</p> 
       <select id="yearInputStart">
          {['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'].map(year => {
            return <option key={year}>{year}</option>
          })}
       </select>
       <br/>
       <p>Month</p> 
       <select id="monthInputStart">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(month => {
            return <option key={month}>{String(+month)}</option>
          })}
       </select>
       <br/>
       <p>Day</p> 
       <select id="dateInputStart">
          {
            '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31'
              .split(",")
              .map(date => {
                return <option key={date}>{date}</option>
              })
          }
       </select>
       <br/>
       <h3>End Date</h3>
       <p>Year</p> 
       <select id="yearInputEnd">
          {['2016', '2017', '2018', '2019', '2020', '2021', '2022'].map(year => {
            return <option key={year}>{year}</option>
          })}
       </select>
       <br/>
       <p>Month</p> <select id="monthInputEnd">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(month => {
            return <option key={month}>{String(+month)}</option>
          })}
       </select>
       <br/>
       <p>Day</p> 
       <select id="dateInputEnd">
          {
            '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31'
              .split(",")
              .map(date => {
                return <option key={date}>{date}</option>
              })
          }
       </select>
       <br/>
       <button onClick={() => {
         let matchType = document.getElementById('matchTypeInput').value;
         let startFunds = Number(document.getElementById('startFundsInput').value.slice(1).replace(/,/g, '')); // slice dollar sign, remove commas, coerce to Number

         let yearStart = document.getElementById('yearInputStart').value;
         let monthStart = +document.getElementById('monthInputStart').value - 1;
         let dateStart = document.getElementById('dateInputStart').value;
         let dateIntegerStart = Date.UTC(yearStart,monthStart,dateStart, 14);
         let dateFormatStart = new Date(dateIntegerStart);

         let yearEnd = document.getElementById('yearInputEnd').value;
         let monthEnd = +document.getElementById('monthInputEnd').value - 1;
         let dateEnd = document.getElementById('dateInputEnd').value;
         let dateIntegerEnd = Date.UTC(yearEnd,monthEnd,dateEnd, 14);
         let dateFormatEnd = new Date(dateIntegerEnd);

          if (dateFormatStart.toString().substr(0, 3) === 'Sun' || dateFormatStart.toString().substr(0, 3) === 'Sat' ) {
           return alert('Stock market\'s not open on '+dateFormat.toString().substr(0,3) + 'day.');
          } else {
            if (dateIntegerStart < Date.now() || dateIntegerStart > dateIntegerEnd) {
              alert('Matches should not start before today, and should not end before they start.');
            } else {
              if (!matchType || !startFunds) {
                alert('Please set both match type and starting funds for this match.')
              } else {
                 let createOptions = {
                   userID: this.props.userID,
                   startDate: dateFormatStart,
                   endDate: dateFormatEnd,
                   startFunds: startFunds,
                   type: matchType === "solo" ? "solo" : "head"
                 };
                createMatch(createOptions); // triggers action creator in actions.js                
              }
            }
          }
       }}>Create a New Match</button>
      </div>
    );
  }

});