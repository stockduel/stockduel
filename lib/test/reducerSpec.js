'use strict';

var _immutable = require('immutable');

var _chai = require('chai');

var _store = require('../../store/store.js');

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  THIS TEST IS NOT UP TO DATE
  USE actionsSpec.js INSTEAD
*/

describe('buyReducer', function () {
  var START_DATE = new Date();
  var END_DATE = new Date(START_DATE.getFullYear() + 1);

  var initialState = (0, _immutable.fromJS)({
    matches: [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }],
    userId: '123',
    currentMatchId: '456'
  });

  it('handles BUY_STOCK for valid trade for a stock that isn\'t held', function () {
    var action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          stockSymbol: 'GOOG',
          shares: '10',
          price: '100'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState.get('matches').toJS()).to.deep.equal(
    //need to fill in full state expected here
    [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [{
          stockSymbol: 'GOOG',
          shares: '10',
          price: '100'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    }]);
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held', function () {
    var action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        }],
        totalValue: '1000000',
        available_cash: '998000'
      }
    };
    var middleState = (0, _reducer2.default)(initialState, action);
    var nextState = (0, _reducer2.default)(middleState, action);
    (0, _chai.expect)(nextState.get('matches').toJS()).to.deep.equal(
    //need to fill in full state expected here
    [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        }],
        totalValue: '1000000',
        available_cash: '998000'
      }
    }]);
  });

  it('handles BUY_STOCK for valid trade for a stock that is already held and another stock is held', function () {
    var action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    };

    var action2 = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '10'
        }, {
          price: '100',
          stockSymbol: 'FB',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '998000'
      }
    };

    var action3 = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        }, {
          price: '100',
          stockSymbol: 'FB',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '997000'
      }
    };

    var state1 = (0, _reducer2.default)(initialState, action);
    var state2 = (0, _reducer2.default)(state1, action2);
    var nextState = (0, _reducer2.default)(state2, action3);
    (0, _chai.expect)(nextState.get('matches').toJS()).to.deep.equal(
    //need to fill in full state expected here
    [{

      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '20'
        }, {
          price: '100',
          stockSymbol: 'FB',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '997000'
      }
    }]);
  });

  it('does not update state for BUY_STOCK with invalid trade', function () {
    var action = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState.toJS()).to.deep.equal(initialState.toJS());
  });
});

describe('sellReducer', function () {
  var START_DATE = new Date();
  var END_DATE = new Date(START_DATE.getFullYear() + 1);
  var initialState = (0, _immutable.fromJS)({
    matches: [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]
  });

  it('handles SELL_STOCK for valid trade', function () {
    //need to have initial state include a stock so we can execute a valid trade
    var actionBuy = {
      type: 'BUY_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [{
          price: '100',
          stockSymbol: 'GOOG',
          shares: '10'
        }],
        totalValue: '1000000',
        available_cash: '999000'
      }
    };

    var actionSell = {
      type: 'SELL_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    var nextState = (0, _reducer2.default)(initialState, actionBuy);
    var finalState = (0, _reducer2.default)(nextState, actionSell);

    (0, _chai.expect)(finalState.get('matches').toJS()).to.deep.equal(
    //need to fill in full state expected here
    [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]);
  });

  it('does not update state for SELL_STOCK with invalid trade', function () {
    var action = {
      type: 'SELL_STOCK',
      userId: '123',
      MatchId: '456',
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState.get('matches').toJS()).to.deep.equal(
    //need to fill in full state expected here
    [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]);
  });
});

describe('Create Match reducer', function () {
  var START_DATE = new Date();
  var END_DATE = new Date(START_DATE.getFullYear() + 1);
  var initialState = (0, _immutable.fromJS)({
    matches: []
  });
  it('adds a new match to the user', function () {
    var action = {
      type: 'CREATE_MATCH',
      currentMatchId: 1,
      match: {
        challengee: '123',
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'solo',
        winner: null,
        portfolio: {
          available_cash: 100000,
          totalValue: 100000
        },
        MatchId: 1
      }
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState.get('matches').count()).to.equal(1);
  });
});

describe('Join Match reducer', function () {
  var START_DATE = new Date();
  var END_DATE = new Date(START_DATE.getFullYear() + 1);
  var initialState = (0, _immutable.fromJS)({
    matches: []
  });
  it('adds a new match to the user', function () {
    var action = {
      type: 'JOIN_MATCH',
      currentMatchId: 1,
      match: {
        creator_id: '234',
        challengee: '123',
        startDate: START_DATE,
        endDate: END_DATE,
        starting_funds: '1000000',
        status: 'progress',
        type: 'head',
        winner: null,
        portfolio: {
          available_cash: 100000,
          totalValue: 100000
        },
        MatchId: 1
      }
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState.get('matches').count()).to.equal(1);
  });
});

describe('general reducer', function () {
  var START_DATE = new Date();
  var END_DATE = new Date(START_DATE.getFullYear() + 1);
  var initialState = (0, _immutable.fromJS)({
    matches: [{
      m_id: '456',
      challengee: '123',
      startDate: START_DATE,
      endDate: END_DATE,
      starting_funds: '1000000',
      status: 'progress',
      type: 'solo',
      winner: null,
      portfolio: {
        stocks: [],
        totalValue: '1000000',
        available_cash: '1000000'
      }
    }]
  });
  it('handles unknown action type', function () {
    var initialState = (0, _immutable.Map)();
    var action = {
      type: 'EAT_PANCAKES'
    };
    var nextState = (0, _reducer2.default)(initialState, action);
    (0, _chai.expect)(nextState).to.equal(initialState);
  });
});