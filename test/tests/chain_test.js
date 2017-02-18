/* eslint-env mocha */
import pchain from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('basic chaining', () => {
  test('returns a promise that contains result of empty chain', () =>
    pchain().then((result) =>
      should.not.exist(result)
    )
  )

  test('returns a promise that contains result of one value chain', () =>
    pchain('a').then((result) =>
      result.should.equal('a')
    )
  )

  test('returns a promise that contains result of one async function', () =>
    pchain(
      () => idAsync('ab')
    ).then((result) =>
      result.should.equal('ab')
    )
  )

  test('returns a promise that contains result of chained functions', () =>
    pchain(
      'a',
      idAsync,
      (value) => idAsync(`${value}b`)
    ).then((result) => result.should.equal('ab'))
  )

  test('compose from functions', () =>
    pchain(
      () => idAsync('a'),
      (value) => idAsync(`${value}b`),
      (value) => idAsync(`${value}c`),
      (result) => result.should.equal('abc')
    )
  )

  test('initial value is passed on', () =>
    pchain(
      'a',
      (value) => idAsync(`${value}b`),
      (result) => result.should.equal('ab')
    )
  )

  test('value in the middle of chain is lifted to function', () =>
    pchain(
      () => idAsync('a'),
      'b',
      (value) => value.should.equal('b')
    )
  )

  test('Promises can be mixed to flow with functions', () => {
    const idPromise = idAsync('x')

    return pchain(
      () => idAsync('a'),
      idPromise,
      (value) => idAsync(`${value}c`),
      (result) => result.should.equal('xc')
    )
  })
})
