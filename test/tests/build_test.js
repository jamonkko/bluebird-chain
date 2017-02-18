/* eslint-env mocha */
import pchain from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('composing chains with build', () => {
  test('simple chain', () => {
    const joinValues = pchain.build(
      idAsync,
      (value) => idAsync(`${value}b`),
      (value) => idAsync(`${value}c`)
    )

    return joinValues('a').then((res) =>
      res.should.equal('abc')
    )
  })

  test('without arguments', () =>
    pchain.build()()
  )

  test('with only a value', () =>
    pchain.build('a')().then((res) =>
      res.should.equal('a')
    )
  )

  test('with bind', () => {
    const joinValues = pchain.build(
      idAsync,
      function foo (value) {
        this.result += value
        return this.result
      }
    )
    const boundJoinValues = joinValues.bind({ result: 'x' })

    return boundJoinValues('z').then(function (res) {
      res.should.equal('xz')
      this.result.should.equal('xz')
    })
  })

  test('with bind and then multiple arguments', () => {
    const joinValues = pchain.build(
      (arg1, arg2) => idAsync(`${arg1}${arg2}`),
      function foo (value) {
        this.other += value
        return this.other
      }
    )
    const boundJoinValues = joinValues.bind({ other: 'y' })

    return boundJoinValues('z', 'x').then(function (res) {
      res.should.equal('yzx')
      this.other.should.equal('yzx')
    })
  })

  test('supports multiple arguments for the first function when applying pre-built chain', () => {
    const joinValues = pchain.build(
      (arg1, arg2) => idAsync(`${arg1}${arg2}`),
      (value) => idAsync(`${value}b`),
      (value) => idAsync(`${value}c`)
    )

    return joinValues('1', 2).then((res) =>
      res.should.equal('12bc')
    )
  })
})
