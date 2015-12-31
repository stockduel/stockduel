import {List, Map, toJS, fromJS} from 'immutable';

//buy reducer takes the old state and the triggered action object and updates the current state to reflect a buy
export default function buyReducer(state, action) {

  var targetMatch;
  var targetMatchIndex;

  //look through the matches in state and find the current match that the action affected and save them to variables
  state.get('matches').forEach(function(match, index) {

    if (match.get('m_id') === action.MatchId) {

      targetMatch = match;
      targetMatchIndex = index;

    }

  });

  //update the portfolio on the current match with the new portfolio from the database
  var newMatchArray = state.get('matches').map(function(match, index) {

    if( index === targetMatchIndex ) {
      return match.set('portfolio', fromJS(action.portfolio));
    }

    return match;

  });

  //update the current state to reflect the users action
  var newState = state.set('matches', newMatchArray);
  newState = newState.set('currentMatchId', action.MatchId);

  return newState.set('error', null);

}