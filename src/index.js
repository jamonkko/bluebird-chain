import Promise from 'bluebird'
const raw = Symbol('raw')

function chainImpl(first, ...functions) {
  function allOrPropsIfNeeded(result) {
    if (!result) {
      return result
    } else if (typeof result.then === 'function') {
      return result
    } else if (result[raw]) {
      return result[raw]()
    } else if (result instanceof Array) {
      return Promise.all(result)
    } else if (typeof result === 'object') {
      return Promise.props(result)
    }
    return result
  }
  return functions
    .map((f) => (f instanceof Function || f[raw]) ? f : () => f)
    .reduce((promise, f) => {
      if (f[raw]) {
        return promise.then(f[raw])
      }
      return promise.then(f).then(allOrPropsIfNeeded)
    }, first)
}

export default {
  chain(...functions) {
    return chainImpl(Promise.resolve(), ...functions)
  },
  bind(state = {}) {
    return {
      chain(...functions) {
        return chainImpl(Promise.resolve().bind(state), ...functions)
      }
    }
  },
  raw(func) {
    return {
      [raw]: func instanceof Function ? func : () => func
    }
  }
}
