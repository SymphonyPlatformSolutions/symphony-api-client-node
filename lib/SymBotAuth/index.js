const fs = require('fs')
const nJwt = require('njwt')
const request = require('../Request')
const jwt = require('jsonwebtoken')

// use exports to avoid circular dependency issues
const SymBotAuth = exports
SymBotAuth.debug = false

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

const randHex = function(len) {
  const maxlength = 8
  const min = Math.pow(16, Math.min(len, maxlength) - 1)
  const max = Math.pow(16, Math.min(len, maxlength)) - 1
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  let r = n.toString(16)

  while (r.length < len) {
    r = r + randHex(len - maxlength)
  }
  return r
}

// Extension Application Authentication https://developers.symphony.com/restapi/reference#application-rsa-authentication
SymBotAuth.extAppAuthenticate = (symConfig) => {
  let options
  let body = { 'appToken': randHex(64) }

  if (symConfig.authType === 'rsa') {
    body.authToken = SymBotAuth.getAppJwtToken(symConfig)
    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/login/v1/pubkey/app/authenticate/extensionApp',
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
      'path': '/sessionauth/v1/authenticate/extensionApp',
      'method': 'POST',
      'pfx': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/extAppAuthenticate', body).then((token) => {
    SymBotAuth.appAuthToken = token.appToken
    return token
  })
}

// OBO Application Authentication
SymBotAuth.oboAppAuthenticate = (symConfig) => {
  let options
  let body

  if (symConfig.authType === 'rsa') {
    // https://developers.symphony.com/restapi/reference#obo-rsa-app-authentication
    body = { token: SymBotAuth.getAppJwtToken(symConfig) }
    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/login/pubkey/app/authenticate',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    // https://developers.symphony.com/restapi/reference#obo-app-authenticate
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

  return request(options, 'SymBotAuth/oboAppAuthenticate', body).then((token) => {
    SymBotAuth.oboAppAuthToken = token.token
    return token
  })
}

const getOboAppAuthToken = async (symConfig) => {
  const response = await SymBotAuth.oboAppAuthenticate(symConfig)
  return response.token
}

// User Authenticate by UserId required for enabling OBO
SymBotAuth.oboAuthenticateByUserId = async (userId) => {
  var options
  var body

  const oboSessionToken = await getOboAppAuthToken(SymBotAuth.symConfig)

  if (SymBotAuth.symConfig.authType === 'rsa') {
    // https://developers.symphony.com/restapi/reference#obo-rsa-user-authentication-by-user-id
    body = { 'token': SymBotAuth.getJwtToken(SymBotAuth.symConfig) }

    options = {
      'hostname': SymBotAuth.symConfig.podHost,
      'port': SymBotAuth.symConfig.podPort,
      'path': '/login/pubkey/app/user/' + userId + '/authenticate',
      'method': 'POST',
      'headers': {
        'sessionToken': oboSessionToken,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': SymBotAuth.symConfig.podProxy
    }
  } else {
    // https://developers.symphony.com/restapi/reference#obo-user-authenticate
    options = {
      'hostname': SymBotAuth.symConfig.sessionAuthHost,
      'port': SymBotAuth.symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/user/' + userId + '/authenticate',
      'method': 'POST',
      'headers': {
        'sessionToken': oboSessionToken
      },
      'key': fs.readFileSync(SymBotAuth.symConfig.appCertPath + SymBotAuth.symConfig.appCertName, 'utf8'),
      'cert': fs.readFileSync(SymBotAuth.symConfig.appCertPath + SymBotAuth.symConfig.appCertName, 'utf8'),
      'passphrase': SymBotAuth.symConfig.appCertPassword,
      'agent': SymBotAuth.symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/userIdAuthenticate', body).then(({ token }) => {
    return token
  })
}

// User Authenticate by Username required for enabling OBO
SymBotAuth.oboAuthenticateByUsername = async (symConfig, username) => {
  var options
  var body

  const oboSessionToken = await getOboAppAuthToken(symConfig)

  if (symConfig.authType === 'rsa') {
    // https://developers.symphony.com/restapi/reference#obo-rsa-userauthentication-by-username
    body = { 'token': SymBotAuth.getJwtToken(symConfig) }

    options = {
      'hostname': symConfig.podHost,
      'port': symConfig.podPort,
      'path': '/login/pubkey/app/username/' + username + '/authenticate',
      'method': 'POST',
      'headers': {
        'sessionToken': oboSessionToken,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'agent': symConfig.podProxy
    }
  } else {
    // https://rest-api.symphony.com/reference#obo-user-authenticate
    options = {
      'hostname': symConfig.sessionAuthHost,
      'port': symConfig.sessionAuthPort,
      'path': '/sessionauth/v1/app/username/' + username + '/authenticate',
      'method': 'POST',
      'headers': {
        'sessionToken': oboSessionToken,
      },
      'pfx': fs.readFileSync(symConfig.appCertPath + symConfig.appCertName),
      'passphrase': symConfig.appCertPassword,
      'agent': symConfig.podProxy
    }
  }

  return request(options, 'SymBotAuth/usernameAuthenticate', body).then(({ token }) => {
    return token
  })
}

SymBotAuth.setupPodCertificate = async (symConfig) => {
  if (SymBotAuth.podCertificate) {
    return SymBotAuth.podCertificate
  }

  const options = {
    'hostname': symConfig.podHost,
    'port': symConfig.podPort,
    'path': '/pod/v1/podcert',
    'method': 'GET',
    'agent': symConfig.podProxy
  }
  return request(options, 'SymBotAuth/setupPodCertificate').then(({ certificate }) => {
    SymBotAuth.podCertificate = certificate
    return certificate
  })
}

SymBotAuth.verifyJWT = async (symConfig, token) => {
  await SymBotAuth.setupPodCertificate(symConfig)

  try {
    return jwt.verify(token, SymBotAuth.podCertificate).user
  } catch (e) {
    return e
  }
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

SymBotAuth.getJwtToken = (symConfig, sub = symConfig.botUsername) => {
  const signingKey = fs.readFileSync(symConfig.botPrivateKeyPath + symConfig.botPrivateKeyName, 'utf8')
  const jwt = nJwt.create({ sub }, signingKey, 'RS512')
  jwt.setExpiration(new Date().getTime() + (3 * 60 * 1000))
  const token = jwt.compact()
  SymBotAuth.jwtToken = token

  return token
}

SymBotAuth.getAppJwtToken = (symConfig) => SymBotAuth.getJwtToken(symConfig, symConfig.appId)
