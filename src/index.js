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
  boundChain(initial = {}, ...functions) {
    let state = initial
    let boundFunctions = functions
    if (state instanceof Function) {
      boundFunctions = [state].concat([state], functions)
      state = {}
    }
    return chainImpl(Promise.resolve().bind(state), ...boundFunctions)
  }
}
