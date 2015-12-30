import {fromJS} from 'immutable';

export default function (state, action) {
  return fromJS({
    userId: '',
    currentMatchId: '',
    matches: [{
      m_id: '',
      portfolio: {
        stocks: [],
        totalValue: '',
        available_cash: ''
      }
    }]
  });
}