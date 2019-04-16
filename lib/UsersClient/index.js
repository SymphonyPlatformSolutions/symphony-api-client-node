const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')
const request = require('../Request')

var UsersClient = {}

// Look up user with a username via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromUsername = (username) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/user?username=' + username,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'UsersClient/getUserFromUsername')
}

// Look up user with an email via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromEmail = (email, local) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/user?email=' + email + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'UsersClient/getUserFromEmail')
}

// Look up user with an email via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromEmailV3 = (email, local) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/users?email=' + email + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'UsersClient/getUserFromEmailV3')
}

// Look up user with a userID via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromIdV3 = (id, local) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/users?uid=' + id + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'UsersClient/getUserFromIdV3')
}

// Look up multiple users with an email via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUsersFromEmailList = (emailList, local) => {
  return UsersClient.getUsersV3(emailList, '', local)
}

// Look up multiple users with userIDs via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUsersFromIdList = (idList, local) => {
  return UsersClient.getUsersV3('', idList, local)
}

UsersClient.getUsersV3 = (emailList, idList, local) => {
  var listPart  = (emailList ? `email=${emailList}` : `uid=${idList}`);
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': `/pod/v3/users${listPart}&local=${(local ? 'true' : 'false')}`,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  return request(options, 'UsersClient/getUsersV3')
}

// Search for users using https://rest-api.symphony.com/reference#search-users
UsersClient.searchUsers = (query, local, skip, limit, filter) => {
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/user/search?local=' + (local ? 'true' : 'false') + '&skip=' + skip + '&limit=' + limit,
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.podProxy
  }

  var body = {
    'query': query,
    'filter': filter
  }

  return request(options, 'UsersClient/searchUsers', body)

}

module.exports = UsersClient
