const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const request = require('.')

function podRequest(method, path, debugId, body) {
  return request(
    {
      method,
      path,
      hostname: SymConfigLoader.SymConfig.podHost,
      port: SymConfigLoader.SymConfig.podPort,
      agent: SymConfigLoader.SymConfig.podProxy,
      headers: {
        sessionToken: SymBotAuth.sessionAuthToken,
      },
    },
    debugId,
    body
  )
}

function agentRequest(method, path, debugId, body) {
  return SymConfigLoader.SymConfig.getAgentHost().then(hostname => {
    return request(
      {
        method,
        path,
        hostname,
        port: SymConfigLoader.SymConfig.agentPort,
        agent: SymConfigLoader.SymConfig.agentProxy,
        headers: {
          sessionToken: SymBotAuth.sessionAuthToken,
          keyManagerToken: SymBotAuth.kmAuthToken,
        },
      },
      debugId,
      body
    )
  })
}

module.exports = { podRequest, agentRequest }
