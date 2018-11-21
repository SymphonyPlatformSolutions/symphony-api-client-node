const fs = require('fs')
const https = require('https')
const Q = require('kew')
const nJwt = require('njwt')

var SymBotAuth = {
  debug: false
}

// Session Authentication using https://rest-api.symphony.com/reference#session-authenticate
SymBotAuth.sessionAuthenticate = (symConfig) => {
  var defer = Q.defer()

  var options = {}
  var jwtToken

  if (symConfig.authType === 'rsa') {
    jwtToken = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/login/pubkey/authenticate',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.proxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      'cert': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      'passphrase': symConfig.botCertPassword,
      'agent': symConfig.proxy
    }
  }
  console.log('options', options)
  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/sessionAuthenticate/str', str)
      }
      var SymSessionToken = JSON.parse(str)
      SymBotAuth.sessionAuthToken = SymSessionToken.token
      defer.resolve(SymSessionToken.token)
    })
    res.on('error', function (err) {
      console.log('[ERROR]', 'SymBotAuth/sessionAuthenticate/err', err)
    })
  })

  if (symConfig.authType === 'rsa') {
    req.write(JSON.stringify(jwtToken))
  }

  req.end()

  return defer.promise
}

// KeyManager Authentication using https://rest-api.symphony.com/reference#key-manager-authenticate
SymBotAuth.kmAuthenticate = (symConfig) => {
  var defer = Q.defer()

  var options = {}
  var jwtToken

  if (symConfig.authType === 'rsa') {
    jwtToken = { 'token': SymBotAuth.jwtToken }
    options = {
      'hostname': symConfig.keyAuthHost,
      'port': symConfig.keyAuthPort,
      'path': '/relay/pubkey/authenticate',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.proxy
    }
  } else {
    options = {
      'hostname': symConfig.keyAuthHost,
      'port': symConfig.keyAuthPort,
      'path': '/keyauth/v1/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      'cert': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      'passphrase': symConfig.botCertPassword,
      'agent': symConfig.proxy
    }
  };

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/kmAuthenticate/str', str)
      }
      var SymKmToken = JSON.parse(str)
      SymBotAuth.kmAuthToken = SymKmToken.token
      defer.resolve(SymKmToken.token)
    })
  })

  if (symConfig.authType === 'rsa') {
    req.write(JSON.stringify(jwtToken))
  }

  req.end()

  return defer.promise
}

// Application Authentication required for obtaining user info https://rest-api.symphony.com/reference#obo-app-authenticate
SymBotAuth.applicationAuthenticate = (symConfig) => {
  var defer = Q.defer()

  var options = {}
  var jwtToken

  if (symConfig.authType === 'rsa') {
    jwtToken = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.proxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'cert': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.proxy
    }
  }
  console.log('options', options)
  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/applicationAuthenticate/str', str)
      }
      var SymAppAuthToken = JSON.parse(str)
      console.log('AppToken: ' + SymAppAuthToken)
      SymBotAuth.appAuthToken = SymAppAuthToken.token
      defer.resolve(SymAppAuthToken.token)
    })
    res.on('error', function (err) {
      console.log('[ERROR]', 'SymBotAuth/applicationAuthenticate/err', err)
    })
  })

  if (symConfig.authType === 'rsa') {
    req.write(JSON.stringify(jwtToken))
  }

  req.end()

  return defer.promise
}

// User Authenticate by UserId required for enabling OBO https://rest-api.symphony.com/reference#obo-user-authenticate
SymBotAuth.oboAuthenticateById = (userId) => {
  var defer = Q.defer()

  var options = {}
  var jwtToken
  var symConfig

  if (symConfig.authType === 'rsa') {
    jwtToken = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.proxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/user/' + userId + '/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'cert': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.proxy
    }
  }
  console.log('options', options)
  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/userIdAuthenticate/str', str)
      }
      var SymAppAuthToken = JSON.parse(str)
      console.log('AppToken: ' + SymAppAuthToken)
      SymBotAuth.appAuthToken = SymAppAuthToken.token
      defer.resolve(SymAppAuthToken.token)
    })
    res.on('error', function (err) {
      console.log('[ERROR]', 'SymBotAuth/userIdAuthenticate/err', err)
    })
  })

  if (symConfig.authType === 'rsa') {
    req.write(JSON.stringify(jwtToken))
  }

  req.end()

  return defer.promise
}

// User Authenticate by Username required for enabling OBO https://rest-api.symphony.com/reference#obo-user-authenticate
SymBotAuth.oboAuthenticateByUsername = (symConfig, username) => {
  var defer = Q.defer()

  var options = {}
  var jwtToken

  if (symConfig.authType === 'rsa') {
    jwtToken = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.proxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/username/' + username + '/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'cert': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName, 'utf8'),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.proxy
    }
  }
  console.log('options', options)
  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/usernameAuthenticate/str', str)
      }
      var SymAppAuthToken = JSON.parse(str)
      console.log('AppToken: ' + SymAppAuthToken)
      SymBotAuth.appAuthToken = SymAppAuthToken.token
      defer.resolve(SymAppAuthToken.token)
    })
    res.on('error', function (err) {
      console.log('[ERROR]', 'SymBotAuth/usernameAuthenticate/err', err)
    })
  })

  if (symConfig.authType === 'rsa') {
    req.write(JSON.stringify(jwtToken))
  }

  req.end()

  return defer.promise
}

SymBotAuth.initBotUser = (symConfig) => {
  var defer = Q.defer()

  var options = {
    'hostname': symConfig.podHost,
    'port': symConfig.podPort,
    'path': '/pod/v3/users?email=' + symConfig.botEmailAddress,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': symConfig.proxy
  }

  var req = https.request(options, function (res) {
    var str = ''
    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      if (SymBotAuth.debug) {
        console.log('[DEBUG]', 'SymBotAuth/initBotUser/str', str)
      }
      var results = JSON.parse(str)
      if (results.users.length > 0) {
        SymBotAuth.botUser = results.users[0]
        console.log('--- Symphony Client initialization ---')
        console.log('The BOT ' + SymBotAuth.botUser.displayName + ' is ready to serve :-)')
        defer.resolve(results.users[0])
      } else {
        defer.resolve({})
      }
    })
  })

  req.end()

  return defer.promise
}

SymBotAuth.authenticate = (symConfig) => {
  var defer = Q.defer()

  SymBotAuth.sessionAuthenticate(symConfig)
    .then((SymSessionToken) => {
      SymBotAuth.kmAuthenticate(symConfig)
        .then((SymKmToken) => {
          SymBotAuth.initBotUser(symConfig)
          defer.resolve({ 'sessionAuthToken': SymSessionToken, 'kmAuthToken': SymKmToken })
        })
        .fail((err) => {
          console.log('err authenticate', err)
        })
    })

  return defer.promise
}

SymBotAuth.nowEpochSeconds = () => {
  return Math.floor(new Date().getTime()) + 20000
}

SymBotAuth.base64urlEncode = (str) => {
  return new Buffer(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

SymBotAuth.getJwtToken = (symConfig) => {
  var signingKey = fs.readFileSync(symConfig.botPrivateKeyPath + symConfig.botPrivateKeyName, 'utf8')

  var claims = {
    sub: symConfig.botUsername
  }

  var jwt = nJwt.create(claims, signingKey, 'RS512')
  jwt.setExpiration(new Date().getTime() + (3 * 60 * 1000))
  var token = jwt.compact()

  SymBotAuth.jwtToken = token
  return token
}

module.exports = SymBotAuth
