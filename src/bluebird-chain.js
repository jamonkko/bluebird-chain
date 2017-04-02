/*!
 * @license
 * bluebird-chain v0.2.0 (https://github.com/jamonkko/bluebird-chain#readme)
 * Copyright 2017 Jarkko Mönkkönen <jamonkko@gmail.com>
 * Licensed under MIT
 */
const esc = Symbol('esc')

let promise = typeof Promise !== 'undefined' ? Promise : undefined
if (promise === undefined) {
  promise = typeof window !== 'undefined' ? window.Promise : undefined
}
const defaultOptions = { aware: true, promise: promise }

function extractOptions ({ aware, promise } = {}) {
  let extracted = {}
  if (typeof aware !== 'undefined') {
    if (aware === true) {
      extracted.aware = { all: true, props: true }
    } else if (typeof aware === 'object') {
      extracted.aware = aware
    } else {
      extracted.aware = !!aware
    }
  }
  if (typeof promise !== 'undefined') {
    extracted.promise = promise
  }
  return extracted
}

function withOptions (opts) {
  const options = extractOptions(opts)

  const option = (key, subkey) => {
    function dig (obj, key, subkey) {
      if (obj === null || typeof obj !== 'object') {
        return {}
      } else {
        if (!obj.hasOwnProperty(key)) {
          return {}
        } else if (subkey === undefined || typeof obj[key] !== 'object') {
          return { val: obj[key] }
        }
        return dig(obj[key], subkey)
      }
    }
    let opt = dig(options, key, subkey)
    return opt.hasOwnProperty('val')
      ? opt.val
      : dig(defaultOptions, key, subkey).val
  }

  function chainImpl (first, ...functions) {
    const allOrPropsIfNeeded = result => {
      if (!result) {
        return result
      } else if (typeof result.then === 'function') {
        return result
      } else if (result.hasOwnProperty(esc)) {
        return result[esc]()
      } else if (!option('aware')) {
        return result
      } else if (result instanceof Array) {
        if (option('aware', 'all')) {
          return option('promise').all(result)
        }
      } else if (option('aware', 'props') && typeof result === 'object') {
        return option('promise').props(result)
      }
      return result
    }

    const liftToFunction = f =>
      f instanceof Function || (typeof f === 'object' && f.hasOwnProperty(esc))
        ? f
        : () => f

    const chainThen = (promise, f) => {
      if (f.hasOwnProperty(esc)) {
        return promise.then(f[esc])
      } else {
        return promise.then(f).then(allOrPropsIfNeeded)
      }
    }

    return functions.map(liftToFunction).reduce(chainThen, first)
  }

  const bluebirdChain = (...functions) =>
    chainImpl(option('promise').resolve(), ...functions)

  bluebirdChain.with = options => withOptions(options)

  bluebirdChain.defaults = options =>
    Object.assign(defaultOptions, extractOptions(options))

  bluebirdChain.build = (first, ...rest) => {
    const chain = (argHead, ...argTail) => {
      if (argTail.length > 0) {
        return chainImpl(
          option('promise').resolve(),
          [argHead, ...argTail],
          bluebirdChain.spread(first),
          ...rest
        )
      } else {
        return chainImpl(option('promise').resolve(), argHead, first, ...rest)
      }
    }
    chain.bind = (state = {}) => (argHead, ...argTail) => {
      if (argTail.length > 0) {
        return chainImpl(
          option('promise').resolve().bind(state),
          [argHead, ...argTail],
          bluebirdChain.spread(first),
          ...rest
        )
      } else {
        return chainImpl(
          option('promise').resolve().bind(state),
          argHead,
          first,
          ...rest
        )
      }
    }
    return chain
  }

  bluebirdChain.spread = func => args => func(...args)

  bluebirdChain.bind = (state = {}) =>
    (...functions) =>
      chainImpl(option('promise').resolve().bind(state), ...functions)

  bluebirdChain.esc = func => ({
    [esc]: func instanceof Function ? func : () => func
  })

  return bluebirdChain
}

const pchain = withOptions()

export { pchain as default }
