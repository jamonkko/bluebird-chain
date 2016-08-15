import Promise from 'bluebird'
import chai from 'chai'
import 'babel-polyfill'

Promise.config({
  warnings: true,
  longStackTraces: true
})

chai.should()
