import Promise from 'bluebird'
import PromiseUtil from '../../src/index.js'

suite("chain", () => {
  test("compose from functions", () =>
    PromiseUtil.chain(
      () => Promise.resolve('a'),
      (value) => Promise.resolve(`${value}b`),
      (value) => Promise.resolve(`${value}c`)
    ).then( (result) =>
      result.should.equal('abc')
    )
  )
})
