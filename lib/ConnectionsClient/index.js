const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

var ConnectionsClient = {}

ConnectionsClient.PENDING_INCOMING = 'Pending Incoming'
ConnectionsClient.PENDING_OUTGOING = 'Pending Outgoing'
ConnectionsClient.ACCEPTED = 'Accepted'
ConnectionsClient.REJECTED = 'Rejected'
ConnectionsClient.ALL = 'All'

// List pending outbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getPendingConnections = (status) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=pending_outgoing',
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getPendingConnections')
}

// List pending inbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getInboundPendingConnections = (status) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=pending_incoming',
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getInboundPendingConnections')
}

// List all current connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAllConnections = (status) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=all',
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getAllConnections')
}

// List accepted connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAcceptedConnections = (status) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=accepted',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getAcceptedConnections')
}

// List rejected connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getRejectedConnections = (status) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=rejected',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getRejectedConnections')
}

// List connection status for an array of users https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getConnections = (status, userIds) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=all?userIds=' + userIds,
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getConnections')
}

// Accept connection request from a requesting user https://rest-api.symphony.com/docs/accepted-connection
ConnectionsClient.acceptConnectionRequest = (userId) => {
  var body = {
    'userId': userId
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/accept',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/acceptConnectionRequest', body)
}

// Reject connection request from a requesting user https://rest-api.symphony.com/docs/reject-connection
ConnectionsClient.rejectConnectionRequest = (userId) => {
  var body = {
    'userId': userId
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/reject',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/rejectConnectionRequest', body)
}

// Create a connection request to another user https://rest-api.symphony.com/docs/create-connection
ConnectionsClient.sendConnectionRequest = (userId) => {
  var body = {
    'userId': userId
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/create',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/sendConnectionRequest', body)
}

// Remove an existing connection to another user https://rest-api.symphony.com/docs/remove-connection
ConnectionsClient.removeConnection = (userId) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/user/' + userId + '/remove',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/removeConnection')
}

// Get connection status for another user https://rest-api.symphony.com/docs/get-connection
ConnectionsClient.getConnectionRequestStatus = (userId) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/user/' + userId + '/info',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'ConnectionsClient/getConnectionRequestStatus')
}

module.exports = ConnectionsClient
