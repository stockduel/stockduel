'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  return state.set('currentMatchId', action.currentMatchId);
};