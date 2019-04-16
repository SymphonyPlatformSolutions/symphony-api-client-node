const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

var AdminUserClient = {}

// Get User V2 using https://rest-api.symphony.com/reference#get-user-v2
AdminUserClient.getUser = (id) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/user/' + id,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminUserClient/getUser')
}

// List all users using https://rest-api.symphony.com/reference#list-users-v2
AdminUserClient.listUsers = (skip = 0, limit = 1000) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/admin/user/list?skip=' + skip + '&limit=' + limit,
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json',
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'AdminUserClient/listUsers')
}

module.exports = AdminUserClient
