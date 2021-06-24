const crypto = require('crypto')

function nowEpochSeconds () {
  return Math.floor(new Date().getTime() / 1000)
}

function base64urlEncode (str) {
  return new Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function Jwt (username, signingKey) {
  this.header = {}
  this.body = {}
  this.header.alg = 'RS512'
  this.body.sub = username
  this.body.exp = (nowEpochSeconds() + (5 * 60)) * 1000 // five minutes
  this.signingKey = signingKey

  return this
}

Jwt.prototype.sign = function sign (payload, cryptoInput) {
  let buffer = crypto.createSign('RSA-SHA512').update(payload).sign(cryptoInput)

  return base64urlEncode(buffer)
}

Jwt.prototype.compact = function compact () {
  let segments = []
  segments.push(base64urlEncode(JSON.stringify(this.header)))
  segments.push(base64urlEncode(JSON.stringify(this.body)))

  this.signature = this.sign(segments.join('.'), this.signingKey)
  segments.push(this.signature)

  return segments.join('.')
}

const secret = '-----BEGIN RSA PRIVATE KEY-----\n' +
    '...REDACTED...' +
    '-----END RSA PRIVATE KEY-----'

const user = 'bot.user1'
const jwt = new Jwt(user, secret)
const jws = jwt.compact()
