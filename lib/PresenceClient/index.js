const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var PresenceClient = {}

PresenceClient.STATUS_AVAILABLE = 'AVAILABLE'
PresenceClient.STATUS_BUSY = 'BUSY'
PresenceClient.STATUS_AWAY = 'AWAY'
PresenceClient.STATUS_ON_THE_PHONE = 'ON_THE_PHONE'
PresenceClient.STATUS_BE_RIGHT_BACK = 'BE_RIGHT_BACK'
PresenceClient.STATUS_IN_A_MEETING = 'IN_A_MEETING'
PresenceClient.STATUS_OUT_OF_OFFICE = 'OUT_OF_OFFICE'
PresenceClient.STATUS_OFF_WORK = 'OFF_WORK'

PresenceClient.getUserPresence = (userId, local) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/user/' + userId + '/presence?local=' + (local ? 'true' : 'false'),
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    }
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'UsersClient/getUserPresence/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

PresenceClient.setPresence = (status) => {
  var defer = Q.defer()

  var body = {
    'category': status
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/user/presence',
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    }
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'UsersClient/setPresence/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(body))
  req.end()

  return defer.promise
}

PresenceClient.registerInterestExtUser = (idList) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/user/presence/register',
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    }
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data ', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'UsersClient/registerInterestExtUser/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(JSON.stringify(idList))
  req.end()

  return defer.promise
}

module.exports = PresenceClient
