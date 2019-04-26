const https = require('https')
const Q = require('kew')
const FormData = require('form-data')
const SymBotAuth = require('../SymBotAuth')

module.exports = function request(options, debugId, body) {
  const defer = Q.defer()

  const errorHandler = err => {
    if (SymBotAuth.debug) {
      console.log('[ERROR]', debugId + '/err', err)
    }
    defer.reject({ status: 'error' })
  }

  if (body) {
    if (body instanceof FormData) {
      Object.assign(options.headers, body.getHeaders())
    } else if (
      !Object.keys(options.headers)
        .map(h => h.toLowerCase())
        .includes('content-type')
    ) {
      options.headers['Content-Type'] = 'application/json'
    }
  }

  const req = https.request(options, res => {
    let str = ''
    res.on('data', chunk => {
      str += chunk
    })
    res.on('end', () => {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', debugId + '/str', str)
      }
      defer.resolve(str === '' ? {} : JSON.parse(str))
    })
    res.on('error', errorHandler)
  })

  req.on('error', errorHandler)

  if (body) {
    if (body instanceof FormData) {
      body.pipe(req)
    } else {
      req.write(JSON.stringify(body))
    }
  }

  req.end()

  return defer.promise
}
