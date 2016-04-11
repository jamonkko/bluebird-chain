'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _raw = Symbol('raw');
var options = {
  aware: false
};

function chainImpl(first) {
  function allOrPropsIfNeeded(result) {
    if (!result) {
      return result;
    } else if (typeof result.then === 'function') {
      return result;
    } else if (result[_raw]) {
      return result[_raw]();
    } else if (!options.aware) {
      return result;
    } else if (result instanceof Array) {
      if (options.aware.all) {
        return _bluebird2.default.all(result);
      }
    } else if (options.aware.props && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
      return _bluebird2.default.props(result);
    }
    return result;
  }

  for (var _len = arguments.length, functions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    functions[_key - 1] = arguments[_key];
  }

  return functions.map(function (f) {
    return f instanceof Function || f[_raw] ? f : function () {
      return f;
    };
  }).reduce(function (promise, f) {
    if (f[_raw]) {
      return promise.then(f[_raw]);
    }
    return promise.then(f).then(allOrPropsIfNeeded);
  }, first);
}

exports.default = {
  config: function config(_ref) {
    var aware = _ref.aware;

    if (typeof aware !== 'undefined') {
      if (aware === true) {
        options.aware = {
          all: true,
          props: true
        };
      } else if ((typeof aware === 'undefined' ? 'undefined' : _typeof(aware)) === 'object') {
        options.aware = Object.assign({}, options.aware, aware);
      } else {
        options.aware = aware;
      }
    }
  },
  chain: function chain() {
    for (var _len2 = arguments.length, functions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      functions[_key2] = arguments[_key2];
    }

    return chainImpl.apply(undefined, [_bluebird2.default.resolve()].concat(functions));
  },
  bind: function bind() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return {
      chain: function chain() {
        for (var _len3 = arguments.length, functions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          functions[_key3] = arguments[_key3];
        }

        return chainImpl.apply(undefined, [_bluebird2.default.resolve().bind(state)].concat(functions));
      }
    };
  },
  raw: function raw(func) {
    return _defineProperty({}, _raw, func instanceof Function ? func : function () {
      return func;
    });
  }
};
module.exports = exports['default'];