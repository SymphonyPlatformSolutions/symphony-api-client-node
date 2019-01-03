const https = require('https')
const Q = require('kew')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

var UsersClient = {}

// Look up user with a username via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromUsername = (username) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/user?username=' + username,
    'method': 'GET',
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
        console.log('[DEBUG]', 'UsersClient/getUserFromUsername/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Look up user with an email via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromEmail = (email, local) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v2/user?email=' + email + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
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
        console.log('[DEBUG]', 'UsersClient/getUserFromEmail/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Look up user with an email via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromEmailV3 = (email, local) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/users?email=' + email + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
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
        console.log('[DEBUG]', 'UsersClient/getUserFromEmailV3/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Look up user with a userID via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromIdV3 = (id, local) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v3/users?uid=' + id + '&local=' + (local ? 'true' : 'false'),
    'method': 'GET',
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
        console.log('[DEBUG]', 'UsersClient/getUserFromIdV3/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
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
  var defer = Q.defer()
  var listPart  = (emailList ? `email=${emailList}` : `uid=${idList}`);
  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': `/pod/v3/users${listPart}&local=${(local ? 'true' : 'false')}`,
    'method': 'GET',
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
        console.log('[DEBUG]', 'UsersClient/getUsersV3/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.end()

  return defer.promise
}

// Search for users using https://rest-api.symphony.com/reference#search-users
UsersClient.searchUsers = (query, local, skip, limit, filter) => {
  var defer = Q.defer()

  var options = {
    'hostname': SymConfigLoader.SymConfig.podHost,
    'port': SymConfigLoader.SymConfig.podPort,
    'path': '/pod/v1/user/search?local=' + (local ? 'true' : 'false') + '&skip=' + skip + '&limit=' + limit,
    'method': 'POST',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': SymConfigLoader.SymConfig.proxy
  }

  var body = {
    'query': query,
    'filter': filter
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'UsersClient/searchUsers/str', str)
      }
      defer.resolve(JSON.parse(str))
    })
  })

  req.write(body)
  req.end()

  return defer.promise
}

module.exports = UsersClient
