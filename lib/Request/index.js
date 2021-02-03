const https = require('https')
const Q = require('q')
const FormData = require('form-data')
const SymBotAuth = require('../SymBotAuth')


module.exports = function request (options, debugId, body = null, fullResponse = false) {
  const defer = Q.defer()

  const errorHandler = err => {
    if (SymBotAuth.debug) {
      console.log('[ERROR]', debugId + '/err', err)
    }
    // MUST pass the error statusCode because there is a logic based on it, i.e. in DatafeedEventsService
    defer.reject({ status: 'error', statusCode: err.code })
  }

  if (!options.headers) {
    options.headers = {}
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
      if (fullResponse) {
        defer.resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: str
        })
      } else {
        const contentTypeHeader = res.headers['content-type'];
        // If the content-type is defined and is not JSON, we do not try to parse
        if (contentTypeHeader !== undefined && !contentTypeHeader.startsWith('application/json')) {
          defer.resolve(str)
        } else {
          defer.resolve(str === '' ? {} : JSON.parse(str))
        }
        
      }
    })
    res.on('error', errorHandler)
  })

  req.on('error', errorHandler)
  req.setTimeout(60000, () => {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', debugId + '/timeout')
    }
    req.abort()
  })

  if (body && body instanceof FormData) {
    body.pipe(req)
  } else {
    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  }

  return defer.promise
}
