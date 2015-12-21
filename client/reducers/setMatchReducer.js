export default function (state, action) {
  //haven't written
  console.log('SET CURRENT MATCH TO ' + action.currentMatchID);
  return state.update('currentMatchID', () => action.currentMatchID);
}
