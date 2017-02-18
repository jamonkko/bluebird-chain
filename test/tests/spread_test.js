/* eslint-env mocha */
import pchain from '../../src/bluebird-chain'
import { idAsync } from '../async_functions'

suite('spread arguments in chain', () => {
  test('spread single array', () =>
    pchain(
      [1, 2, 3],
      pchain.spread((a, b, c) => {
        a.should.equal(1)
        b.should.equal(2)
        c.should.equal(3)
      })
    )
  )

  test('spread results of first promise to other', () =>
    pchain(
      idAsync([[1], 2, 3]),
      pchain.spread((a, b, c) => {
        a.should.eql([1])
        b.should.equal(2)
        c.should.equal(3)
      })
    )
  )
})
