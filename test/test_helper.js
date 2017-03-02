import Promise from 'bluebird'
import chai from 'chai'
import pchain from '../src/bluebird-chain'

Promise.config({ warnings: true, longStackTraces: true })
pchain.defaults({ promise: Promise })

global.should = chai.should()
