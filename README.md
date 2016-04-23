[![Build Status](https://travis-ci.org/jamonkko/node-bluebird-chain.svg?branch=master)](https://travis-ci.org/jamonkko/node-bluebird-chain)
[![Coverage Status](https://coveralls.io/repos/github/jamonkko/node-bluebird-chain/badge.svg?branch=master)](https://coveralls.io/github/jamonkko/node-bluebird-chain?branch=master)
[![npm version](https://img.shields.io/npm/v/bluebird-chain.svg?style=flat-square)](https://www.npmjs.com/package/bluebird-chain)
[![npm downloads](https://img.shields.io/npm/dm/bluebird-chain.svg?style=flat-square)](https://www.npmjs.com/package/bluebird-chain)
# node-bluebird-chain
Compose your async program flow from pure style functions and promises.
Sorry [await](https://tc39.github.io/ecmascript-asyncawait/#examples), it does not really get any better than this!

Or just enjoy writing more compact flat promise chains with only functions and values.
No need to write that Promise.resolve(...).then(...).then(...) boilerplate nor add those explicit Promise.all or Promise.props calls in the middle.


## tl;dr
```javascript
  import P from 'bluebird-chain'
  import _ from 'lodash/fp'
  import { getBooksReadAsync, calculateTasteScoreAsync } from 'my_async_functions'
  P.config({ aware: true })

  P.chain(
    ['John', 'Mary', 'Spirit'],
    _.reduce((res, name) => _.assign(res, {[name]: getBooksReadAsync(name)}), {}),
    _.mapValues((books) => calculateTasteScoreAsync(books)),
    _.toPairs,
    _.map(_.zipObject(['name', 'score'])),
    _.maxBy('score'),
    _.tap(({name}) => console.log(`${name} has the best taste!`))
  )
```
