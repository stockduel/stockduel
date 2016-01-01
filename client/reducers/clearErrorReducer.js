export default function (state, action) {
  return state.update('error', errorValue => null);
}