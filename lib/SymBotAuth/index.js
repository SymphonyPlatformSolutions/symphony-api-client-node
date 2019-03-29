const fs = require('fs')
const nJwt = require('njwt')
const request = require('../Request')

var SymBotAuth = {
  debug: false
}

// Session Authentication using https://rest-api.symphony.com/reference#session-authenticate
SymBotAuth.sessionAuthenticate = (symConfig) => {
  var options
  var body

  if (symConfig.authType === 'rsa') {
    body = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/login/pubkey/authenticate',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/authenticate',
      'method': 'POST',
      'pfx': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName),
      'passphrase': symConfig.botCertPassword,
      'agent': symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/sessionAuthenticate', body).then(({ token }) => {
    SymBotAuth.sessionAuthToken = token
    return token
  })
}

// KeyManager Authentication using https://rest-api.symphony.com/reference#key-manager-authenticate
SymBotAuth.kmAuthenticate = (symConfig) => {
  var options
  var body

  if (symConfig.authType === 'rsa') {
    body = { 'token': SymBotAuth.jwtToken }
    options = {
      'hostname': symConfig.keyAuthHost,
      'port': symConfig.keyAuthPort,
      'path': '/relay/pubkey/authenticate',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.keyManagerProxy
    }
  } else {
    options = {
      'hostname': symConfig.keyAuthHost,
      'port': symConfig.keyAuthPort,
      'path': '/keyauth/v1/authenticate',
      'method': 'POST',
      'pfx': fs.readFileSync(symConfig.botCertPath + symConfig.botCertName),
      'passphrase': symConfig.botCertPassword,
      'agent': symConfig.keyManagerProxy
    }
  }

  return request(options, 'SymBotAuth/kmAuthenticate', body).then(({ token }) => {
    SymBotAuth.kmAuthToken = token
    return token
  })
}

// Application Authentication required for obtaining user info https://rest-api.symphony.com/reference#obo-app-authenticate
SymBotAuth.applicationAuthenticate = (symConfig) => {
  var options
  var body

  if (symConfig.authType === 'rsa') {
    body = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/authenticate',
      'method': 'POST',
      'pfx': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/applicationAuthenticate', body).then(({ token }) => {
    SymBotAuth.appAuthToken = token
    return token
  })
}

// User Authenticate by UserId required for enabling OBO https://rest-api.symphony.com/reference#obo-user-authenticate
SymBotAuth.oboAuthenticateByUserId = (userId) => {
  var options
  var body

  if (SymBotAuth.symConfig.authType === 'rsa') {
    body = { 'token': SymBotAuth.getJwtToken(SymBotAuth.symConfig) }

    options = {
      'hostname': SymBotAuth.symConfig.podHost,
      'port': SymBotAuth.symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    options = {
      'hostname': SymBotAuth.symConfig.sessionAuthHost,
      'port': SymBotAuth.symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/user/' + userId + '/authenticate',
      'method': 'POST',
      'key': fs.readFileSync(SymBotAuth.symConfig.appCertPath + SymBotAuth.symConfig.appCertName, 'utf8'),
      'cert': fs.readFileSync(SymBotAuth.symConfig.appCertPath + SymBotAuth.symConfig.appCertName, 'utf8'),
      'passphrase': SymBotAuth.symConfig.appCertPassword,
      'agent': SymBotAuth.symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/userIdAuthenticate', body).then(({ token }) => {
    SymBotAuth.appAuthToken = token
    return token
  })
}

// User Authenticate by Username required for enabling OBO https://rest-api.symphony.com/reference#obo-user-authenticate
SymBotAuth.oboAuthenticateByUsername = (symConfig, username) => {
  var options
  var body

  if (symConfig.authType === 'rsa') {
    body = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/v1/pubkey/app/authenticate/extensionApp',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/username/' + username + '/authenticate',
      'method': 'POST',
      'pfx': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/usernameAuthenticate', body).then(({ token }) => {
    SymBotAuth.appAuthToken = token
    return token
  })
}

SymBotAuth.initBotUser = (symConfig) => {
  var options = {
    'hostname': symConfig.podHost,
    'port': symConfig.podPort,
    'path': '/pod/v3/users?email=' + symConfig.botEmailAddress,
    'method': 'GET',
    'headers': {
      'sessionToken': SymBotAuth.sessionAuthToken
    },
    'agent': symConfig.podProxy
  }

  return request(options, 'SymBotAuth/initBotUser').then(({ users }) => {
    if (users.length > 0) {
      SymBotAuth.botUser = users[0]
      console.log('--- Symphony Client initialization ---')
      console.log('The BOT ' + SymBotAuth.botUser.displayName + ' is ready to serve :-)')
      return users[0]
    }

    return {}
  })
}

SymBotAuth.authenticate = (symConfig) => {
  SymBotAuth.symConfig = symConfig

  return SymBotAuth.sessionAuthenticate(symConfig).then((SymSessionToken) =>
    SymBotAuth.kmAuthenticate(symConfig).then((SymKmToken) =>
      SymBotAuth.initBotUser(symConfig).then(() => ({
        'sessionAuthToken': SymSessionToken,
        'kmAuthToken': SymKmToken
      }))))
    .fail((err) => {
      console.log('err authenticate', err)
    })
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
