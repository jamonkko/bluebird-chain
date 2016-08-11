import Promise from 'bluebird'
import chai from 'chai'

Promise.config({
  warnings: true,
  longStackTraces: true
})

chai.should()
