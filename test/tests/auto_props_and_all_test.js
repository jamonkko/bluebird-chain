/* eslint-env mocha */
import _ from 'lodash/fp'
import pchain from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('bluebird all and props automatically applied in the chain', () => {
  test('all is automatically applied to the returned array', () =>
    pchain(
      () => [idAsync('a'), idAsync('b')]
    ).then(([a, b]) => {
      a.should.equal('a')
      b.should.equal('b')
    })
  )

  test('all is automatically applied in the chain', () =>
    pchain(
      () => [idAsync('a'), idAsync('b')],
      _.map((val) => idAsync(`${val}map`)),
      ([a, b]) => {
        a.should.equal('amap')
        b.should.equal('bmap')
      }
    )
  )

  test('props is automatically applied to returned object', () =>
    pchain(
      () => (
        {
          a: idAsync('a'),
          b: idAsync('b')
        })
    ).then(({a, b}) => {
      a.should.equal('a')
      b.should.equal('b')
    })
  )

  test('props is automatically applied in chain', () =>
    pchain(
      () => (
        {
          a: idAsync('a'),
          b: idAsync('b')
        }),
      _.mapValues((val) => idAsync(`${val}map`)),
      ({ a, b }) => {
        a.should.equal('amap')
        b.should.equal('bmap')
      }
    )
  )

  test('automatic promise resolving', () =>
    pchain(
      ['a', 'a', 'a', 'b', 'c', 'd', 'c', 'd'],
      _.map((val) => idAsync(val)),
      _.dropWhile((val) => val === 'a'),
      _.groupBy(_.identity),
      _.mapValues(group =>
        Promise.all(group.map((val, index) =>
          idAsync(`${index + 1}${val}`)
        ))),
      ({ b, c, d }) => {
        b.should.have.members(['1b'])
        c.should.have.members(['1c', '2c'])
        d.should.have.members(['1d', '2d'])
      }
    )
  )

  test('automatic props for function can be explicitly escaped from returned value', () =>
    pchain(
      pchain.esc(() => ({
        a: idAsync('a')
      }))
    ).then(({ a }) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic props for function can be explicitly escaped inside chain', () =>
    pchain(
      pchain.esc(() => ({
        a: idAsync('a')
      })),
      ({ a }) =>
        a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic props for function can be turned off', () => {
    return pchain.with({ aware: { props: false } })(
      () => ({
        a: idAsync('a')
      }),
      ({ a }) =>
        a.then.should.be.a('function', 'should still be promise')
    )
  })

  test('automatic all for function can be explicitly escaped', () =>
    pchain(
      pchain.esc(() => [idAsync('a'), idAsync('b')]),
      ([a]) =>
        a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic all for function can be turned off', () => {
    return pchain.with({ aware: { all: false } })(
      () => [idAsync('a'), idAsync('b')],
      ([a]) =>
        a.then.should.be.a('function', 'should still be promise')
    )
  })

  test('automatic all return value can be explicitly escaped', () =>
    pchain(
      () => pchain.esc([idAsync('a'), idAsync('b')])
    ).then(([a]) =>
      a.then.should.be.a('function', 'should still be promise')
    )
  )

  test('automatic resolving can be turned off completely', () => {
    return pchain.with({ aware: false })(
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
