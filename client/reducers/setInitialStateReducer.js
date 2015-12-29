import {fromJS} from 'immutable';

export default function (state, action) {
  return fromJS(action.state);
}

