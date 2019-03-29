const https = require('https')
const FormData = require('form-data')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var OBOClient = {}

// OBO List all user connections using https://rest-api.symphony.com/reference#list-connections
OBOClient.oboGetAllConnections = (status) => {
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
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'OBOClient/oboGetAllConnections/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// OBO Get connection information using https://rest-api.symphony.com/reference#get-connection
OBOClient.oboGetConnection = (userId) => {
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
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'OBOClient/oboGetConnection/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// OBO Create IM or MIM (non inclusive) using https://rest-api.symphony.com/reference#create-im-or-mim-admin
OBOClient.oboGetUserIMStreamId = (userIds) => {
  var defer = Q.defer()

  var body = {
    'userIds': userIds
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/admin/im/create',
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'OBOClient/oboGetUserIMStreamId/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })
  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

//
OBOClient.PRESENTATIONML_FORMAT = 'presentationML'
OBOClient.MESSAGEML_FORMAT = 'messageML'

OBOClient.oboSendMessage = (userToken, conversationId, message, data, format) => {
  if (format === OBOClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data)
  } else if (format === OBOClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data)
  }
}

/* Generic function to send/forward messages from MessagesClient interface */
var send = (userToken, conversationId, message, data) => {
  var defer = Q.defer()

  var form = new FormData()
  form.append('message', message)
  if (data != null) {
    form.append('data', data)
  }

  var headers = form.getHeaders()
  headers.sessionToken = userToken

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v4/stream/' + conversationId + '/message/create',
    'method': 'POST',
    'headers': headers,
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  var req = https.request(options)

  form.pipe(req)

  req.on('response', function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'OBOClient/oboSendMessage/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.on('error', function (e) {
    if (SymBotAuth.debug) {
      console.log('[ERROR]', 'OBOClient/oboSendMessage/error', e)
    }
    defer.reject({ 'status': 'error' })
  })

  return defer.promise
}

module.exports = OBOClient
