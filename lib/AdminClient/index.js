const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var AdminClient = {}

// List Enterprise streams for calling users company using https://rest-api.symphony.com/docs/list-streams-for-enterprise-v2
AdminClient.adminListEnterpriseStreamsV2 = (skip = 0, limit = 50) => {
  var defer = Q.defer()

  var body = {
    'streamTypes': userIds,
    'scope': scope,
    'origin': origin,
    'privacy': privacy,
    'status': status,
    'startDate': startDate,
  }

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/streams/list?skip=' + skip + '&limit=' + limit,
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
        console.log('[DEBUG]', 'AdminClient/adminListEnterpriseStreamsV2/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

module.exports = AdminClient
