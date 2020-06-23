const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const request = require('.')
const PathBuilder = require('./path-builder')

function podRequest(method, path, debugId, body, sessionToken = SymBotAuth.sessionAuthToken) {
  return request(
    {
      method,
      path: PathBuilder.buildPodPath(path),
      hostname: SymConfigLoader.SymConfig.podHost,
      port: SymConfigLoader.SymConfig.podPort,
      agent: SymConfigLoader.SymConfig.podProxy,
      headers: {sessionToken}
    },
    debugId,
    body
  )
}

function agentRequest(method, path, debugId, body, sessionToken = SymBotAuth.sessionAuthToken) {
  const headers = {sessionToken}
  if (sessionToken === SymBotAuth.sessionAuthToken) {
    headers.keyManagerToken = SymBotAuth.kmAuthToken
  }

  return SymConfigLoader.SymConfig.getAgentHost().then(hostname => {
    return request(
      {
        method,
        path: PathBuilder.buildAgentPath(path),
        hostname,
        port: SymConfigLoader.SymConfig.agentPort,
        agent: SymConfigLoader.SymConfig.agentProxy,
        headers
      },
      debugId,
      body
    )
  })
}

module.exports = {podRequest, agentRequest}
