import Promise from 'bluebird'

export default (value) =>
  new Promise((resolve) =>
    setImmediate(resolve, value)
  )
