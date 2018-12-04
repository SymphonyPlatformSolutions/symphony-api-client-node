const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var AdminClient = {}

// List Enterprise streams for calling users company using https://rest-api.symphony.com/docs/list-streams-for-enterprise-v2
AdminClient.adminListEnterpriseStreamsV2 = (streamTypes, scope, origin, privacy, status, startDate, endDate, skip = 0, limit = 100) => {
  var defer = Q.defer()

  var body = {
    'streamTypes': streamTypes,
    'scope': scope,
    'origin': origin,
    'privacy': privacy,
    'status': status,
    'startDate': startDate,
    'endDate': endDate
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/streams/list?skip=' + skip + '&limit=' + limit,
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
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
        console.log('[DEBUG]', 'AdminClient/adminListEnterpriseStreamsV2/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// List all current members of a stream using https://rest-api.symphony.com/docs/stream-members
AdminClient.streamMembers = (id, skip = 0, limit = 1000) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/admin/stream/' + id + '/membership/list?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
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
        console.log('[DEBUG]', 'AdminClient/streamMembers/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Import messages to Symphony using https://rest-api.symphony.com/docs/import-message-v4
// Note: Formatting for messages https://rest-api.symphony.com/v1.52/docs/import-message-v4#v4importedmessage-format
AdminClient.importMessages = (messageList) => {
  var defer = Q.defer()

  var body = {
    'messageList': messageList
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/agent/v4/message/import',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
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
        console.log('[DEBUG]', 'AdminClient/importMessages/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Suppress a message from a stream using https://rest-api.symphony.com/docs/suppress-message
AdminClient.suppressMessage = (id) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/admin/messagesuppression/' + id + '/suppress',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
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
        console.log('[DEBUG]', 'AdminClient/suppressMessage/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

module.exports = AdminClient
