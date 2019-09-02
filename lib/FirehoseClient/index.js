const PubSub = require('pubsub-js')
const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const SymMessageParser = require('../SymMessageParser')
const request = require('../Request')
const { agentRequest } = require('../Request/clients')

const FirehoseClient = {}

FirehoseClient.registerBot = token => {
  FirehoseClient.psToken = token
}

// Create Firehose v1.0 using https://rest-api.symphony.com/v1.53/reference?showHidden=1a1dd#create-firehose-v4
FirehoseClient.createFirehose = () =>
  agentRequest('post', '/agent/v4/firehose/create', 'FirehoseClient/createFirehose')

// Read Firehose v1.0 using https://rest-api.symphony.com/v1.53/reference?showHidden=1a1dd#read-firehose-v4
FirehoseClient.getEventsFromFirehose = firehoseId => {
  return SymConfigLoader.SymConfig.getAgentHost().then(hostname => {
    const options = {
      hostname: hostname,
      port: SymConfigLoader.SymConfig.agentPort,
      path: `/agent/v4/firehose/${firehoseId}/read`,
      method: 'GET',
      headers: {
        sessionToken: SymBotAuth.sessionAuthToken,
        keyManagerToken: SymBotAuth.kmAuthToken
      },
      agent: SymConfigLoader.SymConfig.agentProxy
    }

    return request(options, 'FirehoseClient/getEventsFromFirehouse', null, true).then(response => {
      if (SymBotAuth.debug) {
        console.log(
          '[DEBUG]',
          'FirehoseClient/getEventsFromFirehose/res.statusCode',
          response.statusCode
        )
      }

      if (response.statusCode === 200) {
        PubSub.publish(
          'FIREHOSE: MESSAGE_RECEIVED',
          SymMessageParser.parse(JSON.parse(response.body))
        )
        return { status: 'success' }
      } else if (response.statusCode === 204) {
        return { status: 'timeout' }
      } else {
        throw { status: 'error' }
      }
    })
  })
}

module.exports = FirehoseClient
