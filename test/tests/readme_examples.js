import P from '../../src/index'
import _ from 'lodash/fp'

const getBooksReadAsync = () => new Promise((resolve) =>
  resolve(['Moby Dick', 'A Tale of Two Cities']))

const calculateTasteScoreAsync = () => new Promise((resolve) =>
  resolve(_.random(1, 10)))

suite('readme', () => {
  test('example 1', () =>
    P.chain(
      ['John', 'Mary', 'Spirit'],
      _.reduce((res, name) => _.assign(res, {[name]: getBooksReadAsync(name)}), {}),
      _.mapValues((books) => calculateTasteScoreAsync(books)),
      _.toPairs,
      _.map(_.zipObject(['name', 'score'])),
      _.maxBy('score'),
      _.tap(({name}) => console.log(`${name} has the best taste!`))
    )
  )
})
