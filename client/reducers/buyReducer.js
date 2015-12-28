import {List, Map, toJS, fromJS} from 'immutable';


export default function buyReducer(state, action) {

  var targetMatch;
  var targetMatchIndex;

  state.get('matches').forEach(function(match, index) {

    if (match.get('m_id') === action.MatchId) {

      targetMatch = match;
      targetMatchIndex = index;

    }

  });

  var newMatchArray = state.get('matches').map(function(match, index) {

    if( index === targetMatchIndex ) {
      return match.set('portfolio', fromJS(action.portfolio));
    }

    return match;

  });

  var newState = state.set('matches', newMatchArray);
  newState = newState.set('currentMatchId', action.MatchId);

  return newState;

}
