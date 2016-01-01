export default function (state, action) {
  return state.update('error', errValue => true);
}
