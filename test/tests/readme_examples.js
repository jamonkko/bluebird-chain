/* eslint-env mocha */
import _ from 'lodash/fp'
import pchain from '../../src/bluebird-chain'
import { getBooksReadAsync, calculateTasteScoreAsync } from '../async_functions'

suite('readme', () => {
  test('example 1', () =>
    pchain(
      ['John', 'Mary', 'Spirit'],
      _.reduce((res, name) => _.assign(res, { [name]: getBooksReadAsync(name) }), {}),
      _.mapValues((books) => calculateTasteScoreAsync(books)),
      _.toPairs,
      _.map(_.zipObject(['name', 'score'])),
      _.maxBy('score'),
      _.tap(({ name }) => console.log(`${name} has the best taste!`))
    )
  )
})
