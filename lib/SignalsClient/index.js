const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var SignalsClient = {}

// List signals on behalf of the service user using https://rest-api.symphony.com/docs/list-signals
SignalsClient.listSignals = (skip = 0, limit = 50) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/list?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/listSignals/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Get information about a signal using https://rest-api.symphony.com/docs/get-signal
SignalsClient.getSignal = (id) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/get',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/getSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Create a new signal using https://rest-api.symphony.com/docs/create-signal
SignalsClient.createSignal = (name, query, visibleOnProfile = true, companyWide = false) => {
  var defer = Q.defer()

  var body = {
    'name': name,
    'query': query,
    'visibleOnProfile': visibleOnProfile,
    'companyWide': companyWide
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/create',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/createSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Update an existing signal using https://rest-api.symphony.com/docs/update-signal
SignalsClient.updateSignal = (id, name, query, visibleOnProfile, companyWide) => {
  var defer = Q.defer()

  var body = {
    'name': name,
    'query': query,
    'visibleOnProfile': visibleOnProfile,
    'companyWide': companyWide
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/update',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/updateSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Delete an existing signal using https://rest-api.symphony.com/docs/delete-signal
SignalsClient.deleteSignal = (id) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/delete',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/deleteSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Subscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/subscribe-signal
// Note: To subscribe an entire pod to a Signal, set the companyWide field to true using SignalsClient.updateSignal
SignalsClient.subscribeSignal = (id, userIds, userCanUnsubscribe) => {
  var defer = Q.defer()

  var body = {
    'users': userIds
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/subscribe?pushed=' + (userCanUnsubscribe ? 'true' : 'false'),
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/subscribeSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Unsubscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/unsubscribe-signal
SignalsClient.unsubscribeSignal = (id, userIds) => {
  var defer = Q.defer()

  var body = {
    'users': userIds
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/unsubscribe',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/unsubscribeSignal/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// List users subscribed to an existing signal using https://rest-api.symphony.com/docs/subscribers
SignalsClient.getSignalSubscribers = (id, skip = 0, limit = 50) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/subscribers?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SignalsClient/getSignalSubscribers/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

module.exports = SignalsClient
