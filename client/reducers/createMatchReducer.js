//Create Match Reducer
//--------------------

//import function to create immutable object
import { fromJS } from 'immutable';

export default function (state, action) {
  //add the new match to an array of matches and save that as a new array
  var newMatchesArray = state.get('matches').push(fromJS(action.match));
  //roll that new array of matches into a new state object
  var stateWithNewMatch = state.set('matches', newMatchesArray);
  //return the new state with updated match array and set the currentMatchId
  return stateWithNewMatch.set('currentMatchId', action.currentMatchId);
}

