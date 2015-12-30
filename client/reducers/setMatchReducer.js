//Set Match Reducer
//--------------------

export default function (state, action) {
  //sets the currentMatchId to the id provided in the action
  return state.set('currentMatchId', action.currentMatchId);
}
