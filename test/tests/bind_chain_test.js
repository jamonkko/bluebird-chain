import PromiseUtil from '../../src/index'
import { idAsync } from '../async_functions'

suite('bluebird bind with chaining', () => {
  test('simple binding with automatically created initial bind value', () =>
    PromiseUtil.bind().chain(
      () => idAsync('a'),
      function foo(value) { this.result = value },
      () => idAsync('b'),
      function bar(value) { this.result += value }
    ).then(function end() {
      this.result.should.equal('ab')
    })
  )

  test('initial bind value given', () =>
    PromiseUtil.bind({ result: 'x', other: 'y' }).chain(
      () => idAsync('a'),
      function foo(value) { this.result += value },
      () => idAsync('b'),
      function bar(value) { this.result += value }
    ).then(function end() {
      this.result.should.equal('xab')
      this.other.should.equal('y')
    })
  )
})
