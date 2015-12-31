import {List, Map, toJS, fromJS} from 'immutable';

//sell reducer takes the old state and the triggered action object to update current state to reflect the sell of a stock
export default function sellReducer(state, action) {

  var targetMatch;
  var targetMatchIndex;

  //look through the matches in state and find the current match that the action affected and save them to variables
  state.get('matches').forEach(function(match, index) {

    if (match.get('m_id') === action.MatchId) {

      targetMatch = match;
      targetMatchIndex = index;

    }

  });

  //loop through the matches and update the target match portfolio with the new portfolio from the database
  var newMatchArray = state.get('matches').map(function(match, index) {

    if( index === targetMatchIndex ) {
      return match.set('portfolio', fromJS(action.portfolio));
    }

    return match;

  });

  //update the old state to reflect the user changes
  var newState = state.set('matches', newMatchArray);
  newState = newState.set('currentMatchId', action.MatchId);

  return newState.set('error', null);

}




