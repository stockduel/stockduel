'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buyReducer;

var _immutable = require('immutable');

function buyReducer(state, action) {

  var targetMatch;
  var targetMatchIndex;

  state.get('matches').forEach(function (match, index) {

    if (match.get('m_id') === action.matchID) {

      targetMatch = match;
      targetMatchIndex = index;
    }
  });

  var newMatchArray = state.get('matches').map(function (match, index) {

    if (index === targetMatchIndex) {
      return match.set('portfolio', (0, _immutable.fromJS)(action.portfolio));
    }

    return match;
  });

  var newState = state.set('matches', newMatchArray);
  newState = newState.set('currentMatchId', action.matchID);

  return newState;
}