/*!
 * @license
 * bluebird-chain v0.1.0 (https://github.com/jamonkko/bluebird-chain#readme)
 * Copyright 2017 Jarkko Mönkkönen <jamonkko@gmail.com>
 * Licensed under MIT
 */
import * as bluebird from 'bluebird'

// Make sure that Promise works in browser when there is no import
const Promise = bluebird.Promise || window.Promise

const raw = Symbol('raw')
const options = {}

function chainImpl (first, ...functions) {
  function allOrPropsIfNeeded (result) {
    if (!result) {
      return result
    } else if (typeof result.then === 'function') {
      return result
    } else if (result[raw]) {
      return result[raw]()
    } else if (!options.aware) {
      return result
    } else if (result instanceof Array) {
      if (options.aware.all) {
        return Promise.all(result)
      }
    } else if (options.aware.props && typeof result === 'object') {
      return Promise.props(result)
    }
    return result
  }
  return functions
    .map((f) => ((f instanceof Function || f[raw]) ? f : () => f))
    .reduce((promise, f) => {
      if (f[raw]) {
        return promise.then(f[raw])
      }
      return promise.then(f).then(allOrPropsIfNeeded)
    }, first)
}

const bluebirdChain = (...functions) => bluebirdChain.chain(...functions)

bluebirdChain.config = ({ aware }) => {
  if (typeof aware !== 'undefined') {
    if (aware === true) {
      options.aware = {
        all: true,
        props: true
      }
    } else if (typeof aware === 'object') {
      options.aware = Object.assign({}, options.aware, aware)
    } else {
      options.aware = !!aware
    }
  }
}

bluebirdChain.chain = (...functions) => chainImpl(Promise.resolve(), ...functions)

bluebirdChain.bind = (state = {}) => ({
  chain (...functions) {
    return chainImpl(Promise.resolve().bind(state), ...functions)
  }
})
 
bluebirdChain.raw = (func) => ({
  [raw]: func instanceof Function ? func : () => func
})

bluebirdChain.config({ aware: true })
export { bluebirdChain as default }
