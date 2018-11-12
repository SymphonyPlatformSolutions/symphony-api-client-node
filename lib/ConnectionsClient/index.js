const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var ConnectionsClient = {}

ConnectionsClient.PENDING_INCOMING = 'Pending Incoming'
ConnectionsClient.PENDING_OUTGOING = 'Pending Outgoing'
ConnectionsClient.ACCEPTED = 'Accepted'
ConnectionsClient.REJECTED = 'Rejected'
ConnectionsClient.ALL = 'All'

// List pending outbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getPendingConnections = (status) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=pending_outgoing',
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
        console.log('[DEBUG]', 'ConnectionsClient/getPendingConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List pending inbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getInboundPendingConnections = (status) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=pending_incoming',
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
        console.log('[DEBUG]', 'ConnectionsClient/getInboundPendingConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List all current connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAllConnections = (status) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=all',
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
        console.log('[DEBUG]', 'ConnectionsClient/getAllConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List accepted connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAcceptedConnections = (status) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=accepted',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
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
        console.log('[DEBUG]', 'ConnectionsClient/getAcceptedConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List rejected connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getRejectedConnections = (status) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=rejected',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
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
        console.log('[DEBUG]', 'ConnectionsClient/getRejectedConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List connection status for an array of users https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getConnections = (status, userIds) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/list?status=all?userIds=' + userIds,
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
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
        console.log('[DEBUG]', 'ConnectionsClient/getConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Accept connection request from a requesting user https://rest-api.symphony.com/docs/accepted-connection
ConnectionsClient.acceptConnectionRequest = (userId) => {
  var defer = Q.defer()

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
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'ConnectionsClient/acceptConnectionRequest/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Reject connection request from a requesting user https://rest-api.symphony.com/docs/reject-connection
ConnectionsClient.rejectConnectionRequest = (userId) => {
  var defer = Q.defer()

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
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'ConnectionsClient/rejectConnectionRequest/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Create a connection request to another user https://rest-api.symphony.com/docs/create-connection
ConnectionsClient.sendConnectionRequest = (userId) => {
  var defer = Q.defer()

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
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'ConnectionsClient/sendConnectionRequest/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

// Remove an existing connection to another user https://rest-api.symphony.com/docs/remove-connection
ConnectionsClient.removeConnection = (userId) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/user/' + userId + '/remove',
    'method': 'POST',
    'Content-Type': 'application/json',
    'headers': {
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
        console.log('[DEBUG]', 'ConnectionsClient/removeConnection/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Get connection status for another user https://rest-api.symphony.com/docs/get-connection
ConnectionsClient.getConnectionRequestStatus = (userId) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/connnection/user/' + userId + '/info',
    'method': 'GET',
    'Content-Type': 'application/json',
    'headers': {
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
        console.log('[DEBUG]', 'ConnectionsClient/getConnectionRequestStatus/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

module.exports = ConnectionsClient
