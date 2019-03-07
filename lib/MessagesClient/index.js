const https = require('https')
const FormData = require('form-data')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var MessagesClient = {}

MessagesClient.PRESENTATIONML_FORMAT = 'presentationML'
MessagesClient.MESSAGEML_FORMAT = 'messageML'

MessagesClient.sendMessage = (conversationId, message, data, format) => {
  if (format === MessagesClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data)
  } else if (format === MessagesClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data)
  }
}

MessagesClient.sendMessageWithAttachment = (conversationId, message, data, fileName, fileType, fileContent, format) => {
  if (format === MessagesClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data, fileName, fileType, fileContent)
  } else if (format === MessagesClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data, fileName, fileType, fileContent)
  }
}

MessagesClient.forwardMessage = (conversationId, message, data) => {
  return send(conversationId, message, data)
}

MessagesClient.getAttachment = (streamId, attachmentId, messageId) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v1/stream/' + streamId + '/attachment?messageId=' + messageId + '&fileId=' + attachmentId,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.kmAuthToken
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
        console.log('[DEBUG]', 'MessagesClient/getAttachment/str', str)
      }
      defer.resolve(Buffer.from(str, 'base64'))
    })
  })

  req.end()

  return defer.promise
}

MessagesClient.getMessage = (messageId) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v1/message/' + messageId,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.kmAuthToken
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
        console.log('[DEBUG]', 'MessagesClient/getMessage/str', str)
      }
      defer.resolve((str === '') ? {} : JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

/* Generic function to send/forward messages from MessagesClient interface */
var send = (conversationId, message, data, fileName, fileType, fileContent) => {
  var defer = Q.defer()

  var form = new FormData()
  form.append('message', message)
  if (data != null) {
    form.append('data', data)
  }

  if (fileName != null) {
    form.append('attachment', fileContent, {
      'filename': fileName,
      'contentType': fileType,
      'knownLength': fileContent.length
    })
  }

  var headers = form.getHeaders()
  headers.sessionToken = SymBotAuth.sessionAuthToken
  headers.keyManagerToken = SymBotAuth.kmAuthToken

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v4/stream/' + conversationId + '/message/create',
    'method': 'POST',
    'headers': headers,
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var req = https.request(options)

  form.pipe(req)

  req.on('response', function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      defer.resolve(JSON.parse(str))
    })
  })

  req.on('error', function (e) {
    defer.reject({ 'status': 'error' })
  })

  return defer.promise
}

module.exports = MessagesClient
