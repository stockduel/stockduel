import { fromJS } from 'immutable';

export default function (state, action) {
  var newMatchesArray = state.get('matches').push(fromJS(action.match));
  var stateWithNewMatch = state.set('matches', newMatchesArray);
  return stateWithNewMatch.set('currentMatchId', action.currentMatchId);
}