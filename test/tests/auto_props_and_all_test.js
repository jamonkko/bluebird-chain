import _ from 'lodash/fp'
import P from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('bluebird all and props automatically applied in the chain', () => {
  test('all is automatically applied', () =>
    P.chain(
      () => [idAsync('a'), idAsync('b')],
      _.map((val) => idAsync(`${val}map`))
    ).then(([a, b]) => {
      a.should.equal('amap')
      b.should.equal('bmap')
    })
  )

  test('props is automatically applied', () =>
    P.chain(
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

  test('automatic promise resolving', () =>
    P.chain(
      ['a', 'a', 'a', 'b', 'c', 'd', 'c', 'd'],
      _.map((val) => idAsync(val)),
      _.dropWhile((val) => val === 'a'),
      _.groupBy(_.identity),
      _.mapValues(group =>
        Promise.all(group.map((val, index) =>
          idAsync(`${index + 1}${val}`)
        )))
    ).then(({ b, c, d }) => {
      b.should.have.members(['1b'])
      c.should.have.members(['1c', '2c'])
      d.should.have.members(['1d', '2d'])
    })
  )

  test('automatic props for function can be explicitly avoided', () =>
    P.chain(
      P.raw(() => ({
        a: idAsync('a')
      }))
    ).then(({ a }) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic props for function can be turned off', () => {
    P.config({ aware: { props: false } })
    return P.chain(
      () => ({
        a: idAsync('a')
      })
    ).then(({ a }) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  })

  test('automatic props return value can be explicitly avoided', () =>
    P.chain(
      () => P.raw({
        a: idAsync('a')
      })
    ).then(({ a }) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic all for function can be explicitly avoided', () =>
    P.chain(
      P.raw(() => [idAsync('a'), idAsync('b')])
    ).then(([a]) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic all for function can be turned off', () => {
    P.config({ aware: { all: false } })
    return P.chain(
      () => [idAsync('a'), idAsync('b')]
    ).then(([a]) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  })

  test('automatic all return value can be explicitly avoided', () =>
    P.chain(
      () => P.raw([idAsync('a'), idAsync('b')])
    ).then(([a]) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic resolving can be turned off completely', () => {
    P.config({ aware: false })
    return P.chain(
      () => ({
        a: idAsync('a')
      }),
      ({ a }) =>
        a.then.should.be.a('function', 'should still be promise')
      ,
      () => [idAsync('a'), idAsync('b')],
      ([a]) =>
        a.then.should.be.a('function', 'should still be promise')

    )
  })
})
