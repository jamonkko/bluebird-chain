'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function chainImpl(first) {
  for (var _len = arguments.length, functions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    functions[_key - 1] = arguments[_key];
  }

  return functions.map(function (f) {
    return f instanceof Function ? f : function () {
      return f;
    };
  }).reduce(function (promise, f) {
    return promise.then(f);
  }, first);
}

exports.default = {
  chain: function chain() {
    for (var _len2 = arguments.length, functions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      functions[_key2] = arguments[_key2];
    }

    return chainImpl.apply(undefined, [_bluebird2.default.resolve()].concat(functions));
  },
  boundChain: function boundChain() {
    var initial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var state = initial;

    for (var _len3 = arguments.length, functions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      functions[_key3 - 1] = arguments[_key3];
    }

    var boundFunctions = functions;
    if (state instanceof Function) {
      boundFunctions = [state].concat([state], functions);
      state = {};
    }
    return chainImpl.apply(undefined, [_bluebird2.default.resolve().bind({})].concat(_toConsumableArray(boundFunctions)));
  }
};
module.exports = exports['default'];
