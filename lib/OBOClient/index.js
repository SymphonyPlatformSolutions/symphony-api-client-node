const FormData = require('form-data')
const SymConfigLoader = require('../SymConfigLoader')
const request = require('../Request')
const { podRequest } = require('../Request/clients')

const OBOClient = {}

// OBO List all user connections using https://rest-api.symphony.com/reference#list-connections
OBOClient.oboGetAllConnections = status =>
  podRequest('get', '/pod/v1/connnection/list?status=all', 'OBOClient/oboGetAllConnections')

// OBO Get connection information using https://rest-api.symphony.com/reference#get-connection
OBOClient.oboGetConnection = userId =>
  podRequest('get', `/pod/v1/connnection/user/${userId}/info`, 'OBOClient/oboGetConnection')

// OBO Create IM or MIM (non inclusive) using https://rest-api.symphony.com/reference#create-im-or-mim-admin
OBOClient.oboGetUserIMStreamId = userIds => {
  const body = {
    userIds: userIds,
  }

  return podRequest('post', '/pod/v1/admin/im/create', 'OBOClient/oboGetUserIMStreamId', body)
}

//
OBOClient.PRESENTATIONML_FORMAT = 'presentationML'
OBOClient.MESSAGEML_FORMAT = 'messageML'

OBOClient.oboSendMessage = (userToken, conversationId, message, data, format) => {
  if (format === OBOClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data)
  } else if (format === OBOClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data)
  }
}

/* Generic function to send/forward messages from MessagesClient interface */
function send(userToken, conversationId, message, data) {
  const form = new FormData()
  form.append('message', message)
  if (data != null) {
    form.append('data', data)
  }

  const headers = form.getHeaders()
  headers.sessionToken = userToken

  const options = {
    hostname: SymConfigLoader.SymConfig.agentHost,
    port: SymConfigLoader.SymConfig.agentPort,
    path: `/agent/v4/stream/${conversationId}/message/create`,
    method: 'POST',
    headers: headers,
    agent: SymConfigLoader.SymConfig.podProxy,
  }

  return request(options, 'OBOClient/oboSendMessage', form)
}

module.exports = OBOClient
