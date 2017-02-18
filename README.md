[![Build Status](https://travis-ci.org/jamonkko/bluebird-chain.svg?branch=master)](https://travis-ci.org/jamonkko/bluebird-chain)
[![Coverage Status](https://coveralls.io/repos/github/jamonkko/bluebird-chain/badge.svg?branch=master)](https://coveralls.io/github/jamonkko/bluebird-chain?branch=master)
[![npm version](https://img.shields.io/npm/v/bluebird-chain.svg?style=flat-square)](https://www.npmjs.com/package/bluebird-chain)
[![npm downloads](https://img.shields.io/npm/dm/bluebird-chain.svg?style=flat-square)](https://www.npmjs.com/package/bluebird-chain)
[![Dependency Status](https://david-dm.org/jamonkko/bluebird-chain.svg)](https://david-dm.org/jamonkko/bluebird-chain)
[![devDependency Status](https://david-dm.org/jamonkko/bluebird-chain/dev-status.svg)](https://david-dm.org/jamonkko/bluebird-chain#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
# bluebird-chain
Compose your async program flow from pure style functions and promises.
Sorry [await](https://tc39.github.io/ecmascript-asyncawait/#examples), it does not really get any better than this!

## tl;dr
```javascript
  import pchain from 'bluebird-chain'
  import _ from 'lodash/fp'
  import { getBooksReadAsync, calculateTasteScoreAsync } from 'my_async_functions'

  pchain(
    ['John', 'Mary', 'Spirit'],
    _.reduce((res, name) => _.assign(res, {[name]: getBooksReadAsync(name)}), {}),
    _.mapValues((books) => calculateTasteScoreAsync(books)),
    _.toPairs,
    _.map(_.zipObject(['name', 'score'])),
    _.maxBy('score'),
    _.tap(({name}) => console.log(`${name} has the best taste!`))
  )
```
