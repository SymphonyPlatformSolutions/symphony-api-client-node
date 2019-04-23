const { podRequest, agentRequest } = require('../Request/clients')

const AdminClient = {}

// List Enterprise streams for calling users company using https://rest-api.symphony.com/docs/list-streams-for-enterprise-v2
AdminClient.adminListEnterpriseStreamsV2 = (
  streamTypes,
  scope,
  origin,
  privacy,
  status,
  startDate,
  endDate,
  skip = 0,
  limit = 100
) => {
  const body = {
    streamTypes: streamTypes,
    scope: scope,
    origin: origin,
    privacy: privacy,
    status: status,
    startDate: startDate,
    endDate: endDate,
  }

  return podRequest(
    'post',
    `/pod/v2/admin/streams/list?skip=${skip}&limit=${limit}`,
    'AdminClient/adminListEnterpriseStreamsV2',
    body
  )
}

// List all current members of a stream using https://rest-api.symphony.com/docs/stream-members
AdminClient.streamMembers = (id, skip = 0, limit = 1000) =>
  podRequest(
    'get',
    `/pod/v1/admin/stream/${id}/membership/list?skip=${skip}&limit=${limit}`,
    'AdminClient/streamMembers'
  )

// Import messages to Symphony using https://rest-api.symphony.com/docs/import-message-v4
// Note: Formatting for messages https://rest-api.symphony.com/v1.52/docs/import-message-v4#v4importedmessage-format
AdminClient.importMessages = messageList => {
  const body = {
    messageList: messageList,
  }

  return agentRequest('post', '/agent/v4/message/import', 'AdminClient/importMessages', body)
}

// Suppress a message from a stream using https://rest-api.symphony.com/docs/suppress-message
AdminClient.suppressMessage = id =>
  podRequest(
    'post',
    `/pod/v1/admin/messagesuppression/${id}/suppress`,
    'AdminClient/suppressMessage'
  )

module.exports = AdminClient
