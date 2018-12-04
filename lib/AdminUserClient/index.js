const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var AdminUserClient = {}

// Get User V2 using https://rest-api.symphony.com/reference#get-user-v2
AdminUserClient.getUser = (id) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/user/' + id,
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
        console.log('[DEBUG]', 'AdminUserClient/getUser/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// List all users using https://rest-api.symphony.com/reference#list-users-v2
AdminUserClient.listUsers = (skip = 0, limit = 1000) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/user/list?skip=' + skip + '&limit=' + limit,
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
        console.log('[DEBUG]', 'AdminUserClient/listUsers/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

module.exports = AdminUserClient
