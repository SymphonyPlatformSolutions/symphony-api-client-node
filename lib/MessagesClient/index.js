const FormData = require('form-data')
const request = require('../Request')
const { agentRequest } = require('../Request/clients')
const SymConfigLoader = require('../SymConfigLoader')
const SymBotAuth = require('../SymBotAuth')

const MessagesClient = {}

MessagesClient.PRESENTATIONML_FORMAT = 'presentationML'
MessagesClient.MESSAGEML_FORMAT = 'messageML'

MessagesClient.sendMessage = (conversationId, message, data, format, sessionToken) => {
  if (format === MessagesClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data, undefined, undefined, undefined, sessionToken)
  } else if (format === MessagesClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data, undefined, undefined, undefined, sessionToken)
  }
}

MessagesClient.sendMessageWithAttachment = (
  conversationId,
  message,
  data,
  fileName,
  fileType,
  fileContent,
  format
) => {
  if (format === MessagesClient.PRESENTATIONML_FORMAT) {
    message = '<div data-format="PresentationML" data-version="2.0">' + message + '</div>'
    return send(conversationId, message, data, fileName, fileType, fileContent)
  } else if (format === MessagesClient.MESSAGEML_FORMAT) {
    message = '<messageML>' + message + '</messageML>'
    return send(conversationId, message, data, fileName, fileType, fileContent)
  }
}

MessagesClient.forwardMessage = (conversationId, message, data) => {
  return send(conversationId, message, data)
}

MessagesClient.getAttachment = (streamId, attachmentId, messageId) => {
  return SymConfigLoader.SymConfig.getAgentHost().then(hostname => {
    const options = {
      hostname: hostname,
      port: SymConfigLoader.SymConfig.agentPort,
      path: SymConfigLoader.SymConfig.pathPrefix +`/agent/v1/stream/${streamId}/attachment?messageId=${messageId}&fileId=${attachmentId}`,
      method: 'GET',
      headers: {
        sessionToken: SymBotAuth.sessionAuthToken,
        keyManagerToken: SymBotAuth.kmAuthToken
      },
      agent: SymConfigLoader.SymConfig.agentProxy
    }

    return request(options, 'MessagesClient/getAttachment', null, true).then(response =>
      Buffer.from(response.body, 'base64')
    )
  })
}

MessagesClient.getMessages = (streamId, since, skip = 0, limit = 50) =>
  agentRequest(
    'get',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v4/stream/${streamId}/message?since=${since}&skip=${skip}&limit=${limit}`,
    'MessagesClient/getMessages'
  )

MessagesClient.getMessage = messageId =>
  agentRequest('get', SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/message/${messageId}`, 'MessagesClient/getMessage')

/* Generic function to send/forward messages from MessagesClient interface */
function send (conversationId, message, data, fileName, fileType, fileContent, sessionToken) {
  const form = new FormData()
  form.append('message', message)
  if (data) {
    form.append('data', data)
  }

  if (fileName && fileType && fileContent) {
    form.append('attachment', fileContent, {
      filename: fileName,
      contentType: fileType,
      knownLength: fileContent.length
    })
  }
  return agentRequest(
    'post',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v4/stream/${conversationId}/message/create`,
    'MessagesClient/sendMessage',
    form,
    sessionToken
  )
}

module.exports = MessagesClient
