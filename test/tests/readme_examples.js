/* eslint-disable no-console */
import _ from 'lodash/fp'
import P from '../../src/bluebird-chain'
import { getBooksReadAsync, calculateTasteScoreAsync } from '../async_functions'

suite('readme', () => {
  test('example 1', () =>
    P.chain(
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

/* eslint-enable no-console */
