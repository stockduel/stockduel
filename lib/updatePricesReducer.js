'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  return state.updateIn(['matches', '0', 'portfolio', 'stocks'], function () {
    return action.updatedStockArray;
  });
};