const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const request = require('../Request')
const { agentRequest } = require('../Request/clients')

const DatafeedClient = {}

DatafeedClient.registerBot = (token) => {
  DatafeedClient.psToken = token
}

DatafeedClient.createDatafeed = () =>
  agentRequest('post', SymConfigLoader.SymConfig.pathPrefix + '/agent/v4/datafeed/create', 'DatafeedClient/createDatafeed')

DatafeedClient.getEventsFromDatafeed = datafeedId => {
  return SymConfigLoader.SymConfig.getAgentHost().then(hostname => {
    const options = {
      hostname: hostname,
      port: SymConfigLoader.SymConfig.agentPort,
      path: SymConfigLoader.SymConfig.pathPrefix + `/agent/v4/datafeed/${datafeedId}/read`,
      method: 'GET',
      headers: {
        sessionToken: SymBotAuth.sessionAuthToken,
        keyManagerToken: SymBotAuth.kmAuthToken
      },
      agent: SymConfigLoader.SymConfig.agentProxy
    }

    return request(options, 'DatafeedClient/getEventsFromDatafeed', null, true).then(response => {
      if (SymBotAuth.debug) {
        console.log(
          '[DEBUG]',
          'DatafeedClient/getEventsFromDatafeed/res.statusCode',
          response.statusCode
        )
      }

      if (response.statusCode === 200) {
        return { status: 'success', body: JSON.parse(response.body) }
      } else if (response.statusCode === 204) {
        return { status: 'timeout' }
      } else {
        throw { status: 'error', statusCode: response.statusCode }
      }
    })
  })
}

module.exports = DatafeedClient
