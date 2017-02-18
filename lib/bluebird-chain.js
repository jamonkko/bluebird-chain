/*!
 * @license
 * bluebird-chain v0.2.0 (https://github.com/jamonkko/bluebird-chain#readme)
 * Copyright 2017 Jarkko Mönkkönen <jamonkko@gmail.com>
 * Licensed under MIT
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'bluebird'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('bluebird'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.bluebird);
    global.PC = global.PromiseChain = mod.exports;
  }
})(this, function (module, exports, _bluebird) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var bluebird = _interopRequireWildcard(_bluebird);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // Make sure that Promise works in browser when there is no import
  var Promise = bluebird.Promise || window.Promise;

  var esc = Symbol('esc');
  var options = {};

  function chainImpl(first) {
    function allOrPropsIfNeeded(result) {
      if (!result) {
        return result;
      } else if (typeof result.then === 'function') {
        return result;
      } else if (result[esc]) {
        return result[esc]();
      } else if (!options.aware) {
        return result;
      } else if (result instanceof Array) {
        if (options.aware.all) {
          return Promise.all(result);
        }
      } else if (options.aware.props && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
        return Promise.props(result);
      }
      return result;
    }

    for (var _len = arguments.length, functions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      functions[_key - 1] = arguments[_key];
    }

    return functions.map(function (f) {
      return f instanceof Function || f[esc] ? f : function () {
        return f;
      };
    }).reduce(function (promise, f) {
      if (f[esc]) {
        return promise.then(f[esc]);
      }
      return promise.then(f).then(allOrPropsIfNeeded);
    }, first);
  }

  var bluebirdChain = function bluebirdChain() {
    for (var _len2 = arguments.length, functions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      functions[_key2] = arguments[_key2];
    }

    return chainImpl.apply(undefined, [Promise.resolve()].concat(functions));
  };

  bluebirdChain.config = function (_ref) {
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
        options.aware = !!aware;
      }
    }
  };

  bluebirdChain.bind = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return function () {
      for (var _len3 = arguments.length, functions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        functions[_key3] = arguments[_key3];
      }

      return chainImpl.apply(undefined, [Promise.resolve().bind(state)].concat(functions));
    };
  };

  bluebirdChain.esc = function (func) {
    return _defineProperty({}, esc, func instanceof Function ? func : function () {
      return func;
    });
  };

  bluebirdChain.config({ aware: true });
  exports.default = bluebirdChain;
  module.exports = exports['default'];
});
