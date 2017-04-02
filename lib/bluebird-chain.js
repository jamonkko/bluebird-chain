/*!
 * @license
 * bluebird-chain v0.2.0 (https://github.com/jamonkko/bluebird-chain#readme)
 * Copyright 2017 Jarkko Mönkkönen <jamonkko@gmail.com>
 * Licensed under MIT
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.PC = global.PromiseChain = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /*!
   * @license
   * bluebird-chain v0.2.0 (https://github.com/jamonkko/bluebird-chain#readme)
   * Copyright 2017 Jarkko Mönkkönen <jamonkko@gmail.com>
   * Licensed under MIT
   */
  var esc = Symbol('esc');

  var promise = typeof Promise !== 'undefined' ? Promise : undefined;
  if (promise === undefined) {
    promise = typeof window !== 'undefined' ? window.Promise : undefined;
  }
  var defaultOptions = { aware: true, promise: promise };

  function extractOptions() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        aware = _ref.aware,
        promise = _ref.promise;

    var extracted = {};
    if (typeof aware !== 'undefined') {
      if (aware === true) {
        extracted.aware = { all: true, props: true };
      } else if ((typeof aware === 'undefined' ? 'undefined' : _typeof(aware)) === 'object') {
        extracted.aware = aware;
      } else {
        extracted.aware = !!aware;
      }
    }
    if (typeof promise !== 'undefined') {
      extracted.promise = promise;
    }
    return extracted;
  }

  function withOptions(opts) {
    var options = extractOptions(opts);

    var option = function option(key, subkey) {
      function dig(obj, key, subkey) {
        if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
          return {};
        } else {
          if (!obj.hasOwnProperty(key)) {
            return {};
          } else if (subkey === undefined || _typeof(obj[key]) !== 'object') {
            return { val: obj[key] };
          }
          return dig(obj[key], subkey);
        }
      }
      var opt = dig(options, key, subkey);
      return opt.hasOwnProperty('val') ? opt.val : dig(defaultOptions, key, subkey).val;
    };

    function chainImpl(first) {
      var allOrPropsIfNeeded = function allOrPropsIfNeeded(result) {
        if (!result) {
          return result;
        } else if (typeof result.then === 'function') {
          return result;
        } else if (result.hasOwnProperty(esc)) {
          return result[esc]();
        } else if (!option('aware')) {
          return result;
        } else if (result instanceof Array) {
          if (option('aware', 'all')) {
            return option('promise').all(result);
          }
        } else if (option('aware', 'props') && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
          return option('promise').props(result);
        }
        return result;
      };

      var liftToFunction = function liftToFunction(f) {
        return f instanceof Function || (typeof f === 'undefined' ? 'undefined' : _typeof(f)) === 'object' && f.hasOwnProperty(esc) ? f : function () {
          return f;
        };
      };

      var chainThen = function chainThen(promise, f) {
        if (f.hasOwnProperty(esc)) {
          return promise.then(f[esc]);
        } else {
          return promise.then(f).then(allOrPropsIfNeeded);
        }
      };

      for (var _len = arguments.length, functions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        functions[_key - 1] = arguments[_key];
      }

      return functions.map(liftToFunction).reduce(chainThen, first);
    }

    var bluebirdChain = function bluebirdChain() {
      for (var _len2 = arguments.length, functions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        functions[_key2] = arguments[_key2];
      }

      return chainImpl.apply(undefined, [option('promise').resolve()].concat(functions));
    };

    bluebirdChain.with = function (options) {
      return withOptions(options);
    };

    bluebirdChain.defaults = function (options) {
      return _extends(defaultOptions, extractOptions(options));
    };

    bluebirdChain.build = function (first) {
      for (var _len3 = arguments.length, rest = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        rest[_key3 - 1] = arguments[_key3];
      }

      var chain = function chain(argHead) {
        for (var _len4 = arguments.length, argTail = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          argTail[_key4 - 1] = arguments[_key4];
        }

        if (argTail.length > 0) {
          return chainImpl.apply(undefined, [option('promise').resolve(), [argHead].concat(argTail), bluebirdChain.spread(first)].concat(rest));
        } else {
          return chainImpl.apply(undefined, [option('promise').resolve(), argHead, first].concat(rest));
        }
      };
      chain.bind = function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return function (argHead) {
          for (var _len5 = arguments.length, argTail = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            argTail[_key5 - 1] = arguments[_key5];
          }

          if (argTail.length > 0) {
            return chainImpl.apply(undefined, [option('promise').resolve().bind(state), [argHead].concat(argTail), bluebirdChain.spread(first)].concat(rest));
          } else {
            return chainImpl.apply(undefined, [option('promise').resolve().bind(state), argHead, first].concat(rest));
          }
        };
      };
      return chain;
    };

    bluebirdChain.spread = function (func) {
      return function (args) {
        return func.apply(undefined, _toConsumableArray(args));
      };
    };

    bluebirdChain.bind = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return function () {
        for (var _len6 = arguments.length, functions = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          functions[_key6] = arguments[_key6];
        }

        return chainImpl.apply(undefined, [option('promise').resolve().bind(state)].concat(functions));
      };
    };

    bluebirdChain.esc = function (func) {
      return _defineProperty({}, esc, func instanceof Function ? func : function () {
        return func;
      });
    };

    return bluebirdChain;
  }

  var pchain = withOptions();

  exports.default = pchain;
  module.exports = exports['default'];
});
