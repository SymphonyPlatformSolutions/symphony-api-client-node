const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

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
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/user/' + userId + '/presence?local=' + (local ? 'true' : 'false'),
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

    return request(options, 'UsersClient/getUserPresence')
}

PresenceClient.setPresence = (status) => {
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
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

    return request(options, 'UsersClient/setPresence', body)
}

PresenceClient.registerInterestExtUser = (idList) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/user/presence/register',
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

    return request(options, 'UsersClient/registerInterestExtUser')
}

module.exports = PresenceClient
