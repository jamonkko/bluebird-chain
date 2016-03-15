import Promise from 'bluebird'
import _ from 'lodash/fp'

export const idAsync = (value) =>
  new Promise((resolve) =>
    setImmediate(resolve, value)
  )

export const getBooksReadAsync = () => new Promise((resolve) =>
  resolve(['Moby Dick', 'A Tale of Two Cities']))

export const calculateTasteScoreAsync = () => new Promise((resolve) =>
  resolve(_.random(1, 10)))
