const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

var SignalsClient = {}

// List signals on behalf of the service user using https://rest-api.symphony.com/docs/list-signals
SignalsClient.listSignals = (skip = 0, limit = 50) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/list?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/listSignals')
}

// Get information about a signal using https://rest-api.symphony.com/docs/get-signal
SignalsClient.getSignal = (id) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/get',
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/getSignal')
}

// Create a new signal using https://rest-api.symphony.com/docs/create-signal
SignalsClient.createSignal = (name, query, visibleOnProfile = true, companyWide = false) => {
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
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/createSignal', body)
}

// Update an existing signal using https://rest-api.symphony.com/docs/update-signal
SignalsClient.updateSignal = (id, name, query, visibleOnProfile, companyWide) => {
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
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/updateSignal', body)
}

// Delete an existing signal using https://rest-api.symphony.com/docs/delete-signal
SignalsClient.deleteSignal = (id) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/delete',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/deleteSignal')
}

// Subscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/subscribe-signal
// Note: To subscribe an entire pod to a Signal, set the companyWide field to true using SignalsClient.updateSignal
SignalsClient.subscribeSignal = (id, userIds, userCanUnsubscribe) => {
  var body = {
    'users': userIds
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/subscribe?pushed=' + (userCanUnsubscribe ? 'true' : 'false'),
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/subscribeSignal', body)
}

// Unsubscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/unsubscribe-signal
SignalsClient.unsubscribeSignal = (id, userIds) => {
  var body = {
    'users': userIds
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/unsubscribe',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/unsubscribeSignal', body)
}

// List users subscribed to an existing signal using https://rest-api.symphony.com/docs/subscribers
SignalsClient.getSignalSubscribers = (id, skip = 0, limit = 50) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v1/signals/' + id + '/subscribers?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.keyManagerToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'SignalsClient/getSignalSubscribers')
}

module.exports = SignalsClient
