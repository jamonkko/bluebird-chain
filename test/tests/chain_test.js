import Promise from 'bluebird'
import PromiseUtil from '../../src/index'
import idAsync from '../async_function'

suite("basic chaining", () => {

  test("compose from functions", () =>
    PromiseUtil.chain(
      () => idAsync('a'),
      (value) => idAsync(`${value}b`),
      (value) => idAsync(`${value}c`)
    ).then( (result) =>
      result.should.equal('abc')
    )
  )

  test("Initial value is passed on", () =>
    PromiseUtil.chain(
      'a',
      (value) => idAsync(`${value}b`)
    ).then( (result) =>
      result.should.equal('ab')
    )
  )

  test("value in the middle of chain is lifted to function", () =>
    PromiseUtil.chain(
      () => idAsync('a'),
      'b',
      (value) => idAsync(`${value}c`)
    ).then( (result) =>
      result.should.equal('bc')
    )
  )

  test("Promises can be mixed to flow with functions", () => {
    const xPromise = idAsync('x');

    return PromiseUtil.chain(
      () => idAsync('a'),
      xPromise,
      (value) => idAsync(`${value}c`)
    ).then( (result) =>
      result.should.equal('xc')
    )
  })

})
