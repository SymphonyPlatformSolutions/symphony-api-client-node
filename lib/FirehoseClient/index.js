const https = require('https')
const Q = require('kew')
const PubSub = require('pubsub-js')
const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const SymMessageParser = require('../SymMessageParser')

var FirehoseClient = {}

FirehoseClient.registerBot = (token) => {
  FirehoseClient.psToken = token
}

// Create Firehose v1.0 using https://rest-api.symphony.com/v1.53/reference?showHidden=1a1dd#create-firehose-v4
FirehoseClient.createFirehose = () => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v4/firehose/create',
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.kmAuthToken
    },
    'agent': SymConfigLoader.SymConfig.agentProxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'FirehoseClient/createFirehose/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })
  req.on('error', function (e) {
    console.log('error', e)
  })

  req.end()

  return defer.promise
}

// Read Firehose v1.0 using https://rest-api.symphony.com/v1.53/reference?showHidden=1a1dd#read-firehose-v4
FirehoseClient.getEventsFromFirehose = (firehoseId) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.agentHost,
    'port': SymConfigLoader.SymConfig.agentPort,
    'path': '/agent/v4/firehose/' + firehoseId + '/read',
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken,
      'keyManagerToken': SymBotAuth.kmAuthToken
    },
    'agent': SymConfigLoader.SymConfig.agentProxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'FirehoseClient/getEventsFromFirehose/res.statusCode', res.statusCode)
        console.log('[DEBUG]', 'FirehoseClient/getEventsFromFirehouse/str', str)
      }
      if (res.statusCode === 200) {
        PubSub.publish('FIREHOSE: MESSAGE_RECEIVED', SymMessageParser.parse(str))
        defer.resolve({ 'status': 'success' })
      } else if (res.statusCode === 204) {
        defer.resolve({ 'status': 'timeout' })
      } else {
        defer.reject({ 'status': 'error' })
      }
    })
  })
  req.on('error', function (e) {
    defer.reject({ 'status': 'error' })
  })

  req.end()

  return defer.promise
}

module.exports = FirehoseClient
