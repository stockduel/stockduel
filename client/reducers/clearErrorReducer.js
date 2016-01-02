//sets the error property on state back to null, clearing out the error
export default function (state, action) {
  return state.update('error', errorValue => null);
}
