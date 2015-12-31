'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  return (0, _immutable.fromJS)(action.state);
};

var _immutable = require('immutable');