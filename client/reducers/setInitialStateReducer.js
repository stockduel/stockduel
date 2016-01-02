//import function to create immutable object
import {fromJS} from 'immutable';

//sends back the state that came in with the action
export default function (state, action) {
  return fromJS(action.state);
}
