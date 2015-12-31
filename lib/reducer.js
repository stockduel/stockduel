'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _actions = require('../actions/actions.js');

var _buyReducer = require('./buyReducer');

var _buyReducer2 = _interopRequireDefault(_buyReducer);

var _sellReducer = require('./sellReducer');

var _sellReducer2 = _interopRequireDefault(_sellReducer);

var _updatePricesReducer = require('./updatePricesReducer');

var _updatePricesReducer2 = _interopRequireDefault(_updatePricesReducer);

var _setMatchReducer = require('./setMatchReducer');

var _setMatchReducer2 = _interopRequireDefault(_setMatchReducer);

var _setInitialStateReducer = require('./setInitialStateReducer');

var _setInitialStateReducer2 = _interopRequireDefault(_setInitialStateReducer);

var _createMatchReducer = require('./createMatchReducer');

var _createMatchReducer2 = _interopRequireDefault(_createMatchReducer);

var _joinMatchReducer = require('./joinMatchReducer');

var _joinMatchReducer2 = _interopRequireDefault(_joinMatchReducer);

var _logoutReducer = require('./logoutReducer');

var _logoutReducer2 = _interopRequireDefault(_logoutReducer);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: generate initial state via AJAX call instead of hardcoding
// 'GET' /users/:userId

//============== Useful pre-populated state for testing ==================\\
// const initialState = fromJS({
//     userId: '123',
//     currentMatchId: '456',
//     matches: [{
//       MatchId: '456',
//       portfolio: {
//         //stock_symbol, shares, price
//         stocks: [],
//         //we need to calculate on the front end
//         totalValue: '1000000',
//         //cash_in_hand
//         available_cash: '1000000'
//       }
//     }]
//   });

//============== Initial empty state to allow HTML rendering before data arrives ===================\\
var initialState = (0, _immutable.fromJS)({
  userId: '',
  currentMatchId: '',
  matches: [{
    m_id: '',
    portfolio: {
      //stock_symbol, shares, price
      stocks: [],
      //we need to calculate on the front end
      totalValue: '',
      //cash_in_hand
      available_cash: ''
    }
  }]
});

function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.BUY_STOCK:
      return (0, _buyReducer2.default)(state, action);
    case _actions.SELL_STOCK:
      return (0, _sellReducer2.default)(state, action);
    case _actions.UPDATE_PRICES:
      return (0, _updatePricesReducer2.default)(state, action);
    case _actions.SET_CURRENT_MATCH:
      return (0, _setMatchReducer2.default)(state, action);
    case _actions.SET_INITIAL_STATE:
      return (0, _setInitialStateReducer2.default)(state, action);
    case _actions.CREATE_MATCH:
      return (0, _createMatchReducer2.default)(state, action);
    case _actions.JOIN_MATCH:
      return (0, _joinMatchReducer2.default)(state, action);
    case _actions.LOGOUT:
      return (0, _logoutReducer2.default)(state, action);
    default:
      return state;
  }
}