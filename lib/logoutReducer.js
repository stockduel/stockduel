'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  return (0, _immutable.fromJS)({
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
};

var _immutable = require('immutable');