/* eslint-env mocha */
import pchain from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('bluebird bind with chaining', () => {
  test('simple binding with automatically created initial bind value', () =>
    pchain.bind()(
      () => idAsync('a'),
      function foo (value) { this.result = value },
      () => idAsync('b'),
      function bar (value) { this.result += value }
    ).then(function end () {
      this.result.should.equal('ab')
    })
  )

  test('initial bind value given', () =>
    pchain.bind({ result: 'x', other: 'y' })(
      () => idAsync('a'),
      function foo (value) { this.result += value },
      () => idAsync('b'),
      function bar (value) { this.result += value }
    ).then(function end () {
      this.result.should.equal('xab')
      this.other.should.equal('y')
    })
  )
})
