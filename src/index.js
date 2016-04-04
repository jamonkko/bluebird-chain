import Promise from 'bluebird'
const raw = Symbol('raw')
const options = {
  aware: false
}

function chainImpl(first, ...functions) {
  function allOrPropsIfNeeded(result) {
    if (!result) {
      return result
    } else if (typeof result.then === 'function') {
      return result
    } else if (result[raw]) {
      return result[raw]()
    } else if (!options.aware) {
      return result
    } else if (options.aware.all && result instanceof Array) {
      return Promise.all(result)
    } else if (options.aware.props && typeof result === 'object') {
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
  config({ aware }) {
    if (typeof aware !== 'undefined') {
      if (aware === true) {
        options.aware = {
          all: true,
          props: true
        }
      } else if (typeof aware === 'object') {
        options.aware = Object.assign({}, options.aware, aware)
      } else {
        options.aware = aware
      }
    }
  },
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
