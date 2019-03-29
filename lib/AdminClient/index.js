const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

var AdminClient = {}

// List Enterprise streams for calling users company using https://rest-api.symphony.com/docs/list-streams-for-enterprise-v2
AdminClient.adminListEnterpriseStreamsV2 = (streamTypes, scope, origin, privacy, status, startDate, endDate, skip = 0, limit = 100) => {
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
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminClient/adminListEnterpriseStreamsV2', body)
}

// List all current members of a stream using https://rest-api.symphony.com/docs/stream-members
AdminClient.streamMembers = (id, skip = 0, limit = 1000) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/admin/stream/' + id + '/membership/list?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminClient/streamMembers')
}

// Import messages to Symphony using https://rest-api.symphony.com/docs/import-message-v4
// Note: Formatting for messages https://rest-api.symphony.com/v1.52/docs/import-message-v4#v4importedmessage-format
AdminClient.importMessages = (messageList) => {
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
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminClient/importMessages', body)
}

// Suppress a message from a stream using https://rest-api.symphony.com/docs/suppress-message
AdminClient.suppressMessage = (id) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/admin/messagesuppression/' + id + '/suppress',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminClient/suppressMessage')
}

module.exports = AdminClient
