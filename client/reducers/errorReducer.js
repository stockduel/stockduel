//sets the error property on state to true, indicating that there is an error
export default function (state, action) {
  return state.set('error', true);
}
