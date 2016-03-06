import Promise from 'bluebird'

function chainImpl(first, ...functions) {
  return functions
    .map((f) => f instanceof Function ? f : () => f)
    .reduce((promise, f) => promise.then(f), first)
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
  }
}
