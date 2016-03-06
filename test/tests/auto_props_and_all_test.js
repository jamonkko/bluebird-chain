import PromiseUtil from '../../src/index'
import idAsync from '../async_function'
import _ from 'lodash/fp'

suite('bluebird all and props automatically applied in the chain', () => {
  test('all is automatically applied', () =>
    PromiseUtil.chain(
      () => [idAsync('a'), idAsync('b')],
      _.map((val) => idAsync(`${val}map`))
    ).then(([a, b]) => {
      a.should.equal('amap')
      b.should.equal('bmap')
    })
  )

  test('props is automatically applied', () =>
    PromiseUtil.chain(
      () => (
        {
          a: idAsync('a'),
          b: idAsync('b')
        }),
      _.mapValues((val) => idAsync(`${val}map`))
    ).then(({ a, b }) => {
      a.should.equal('amap')
      b.should.equal('bmap')
    })
  )

  test('automatic props for function can be explicitly avoided', () =>
    PromiseUtil.chain(
      PromiseUtil.raw(() => ({
        a: idAsync('a')
      }))
    ).then(({ a }) => {
      a.then.should.be.a('function', 'should still be promise')
    })
  )

  test('automatic props return value can be explicitly avoided', () =>
    PromiseUtil.chain(
      () => PromiseUtil.raw({
        a: idAsync('a')
      })
    ).then(({ a }) => {
      a.then.should.be.a('function', 'should still be promise')
    })
  )

  test('automatic all for function can be explicitly avoided', () =>
    // TODO
    true
  )

  test('automatic all return value can be explicitly avoided', () =>
    true // TODO
  )
})
