const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const SymMessageParser = require('../SymMessageParser')
const request = require('../Request')
const { agentRequest } = require('../Request/clients')

const DatafeedClient = {}

DatafeedClient.registerBot = (token) => {
  DatafeedClient.psToken = token
}

DatafeedClient.createDatafeed = () =>
  agentRequest('post', '/agent/v4/datafeed/create', 'DatafeedClient/createDatafeed')

DatafeedClient.getEventsFromDatafeed = datafeedId => {
  const options = {
    hostname: SymConfigLoader.SymConfig.getAgentHost(),
    port: SymConfigLoader.SymConfig.agentPort,
    path: `/agent/v4/datafeed/${datafeedId}/read`,
    method: 'GET',
    headers: {
      sessionToken: SymBotAuth.sessionAuthToken,
      keyManagerToken: SymBotAuth.kmAuthToken,
    },
    agent: SymConfigLoader.SymConfig.agentProxy,
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
      return { status: 'success', body: SymMessageParser.parse(response.body) }
    } else if (response.statusCode === 204) {
      return { status: 'timeout' }
    } else {
      throw { status: 'error', statusCode: response.statusCode }
    }
  })
}

module.exports = DatafeedClient
