//helper functions for the controllers

var methods = {};
//function to compare times and work out the status of the game
//NOT MVP come back to this! Need to have the date passed in as new date object for getTime() to work

methods.getStatus = function (startDate, endDate) {

  //function to get the status of the match
  var now = new Date();
  console.log('TIMES------', startDate, endDate);

  //get time returns Return the number of milliseconds since 1970/01/01
  //allows developer to compare times
  if (now.getTime() < startDate.getTime()) {
    return 'Match pending';
  } else if (now.getTime() > startDate.getTime() && now.getTime() < endDate.getTime()) {
    return 'Match in progress';
  } else if (now.getTime() > endDate.getTime()) {
    return 'Match finished';
  }

};

module.exports = methods;
