import Promise from 'bluebird'
import PromiseUtil from '../../src/index'
import idAsync from '../async_function'

suite("bluebird bind with chaining", () => {

  test("simple binding with automatically created initial bind value", () =>
    PromiseUtil.boundChain(
      () => idAsync('a'),
      function (value) {this.result = value},
      () => idAsync('b'),
      function (value) {this.result += value}
    ).then( function (value) {
      this.result.should.equal('ab')
    })
  )

  test("initial bind value given as first argument", () =>
    PromiseUtil.boundChain(
      {result: 'x', other: 'y'},
      () => idAsync('a'),
      function (value) {this.result += value},
      () => idAsync('b'),
      function (value) {this.result += value}
    ).then( function (value) {
      this.result.should.equal('xab')
      this.other.should.equal('y')
    })
  )

})
