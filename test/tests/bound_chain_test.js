import PromiseUtil from '../../src/index'
import idAsync from '../async_function'

suite('bluebird bind with chaining', () => {
  test('simple binding with automatically created initial bind value', () =>
    PromiseUtil.boundChain(
      () => idAsync('a'),
      function foo(value) {this.result = value},
      () => idAsync('b'),
      function bar(value) {this.result += value}
    ).then(function end() {
      this.result.should.equal('ab')
    })
  )

  test('initial bind value given as first argument', () =>
    PromiseUtil.boundChain(
      { result: 'x', other: 'y' },
      () => idAsync('a'),
      function foo(value) {this.result += value},
      () => idAsync('b'),
      function bar(value) {this.result += value}
    ).then(function end() {
      this.result.should.equal('xab')
      this.other.should.equal('y')
    })
  )
})
