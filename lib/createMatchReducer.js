'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  var newMatchesArray = state.get('matches').push((0, _immutable.fromJS)(action.match));
  var stateWithNewMatch = state.set('matches', newMatchesArray);
  return stateWithNewMatch.set('currentMatchId', action.currentMatchId);
};

var _immutable = require('immutable');