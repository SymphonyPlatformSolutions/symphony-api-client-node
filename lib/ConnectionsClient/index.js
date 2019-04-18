const { podRequest } = require('../Request/clients')

const ConnectionsClient = {}

ConnectionsClient.PENDING_INCOMING = 'Pending Incoming'
ConnectionsClient.PENDING_OUTGOING = 'Pending Outgoing'
ConnectionsClient.ACCEPTED = 'Accepted'
ConnectionsClient.REJECTED = 'Rejected'
ConnectionsClient.ALL = 'All'

// List pending outbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getPendingConnections = () =>
  podRequest(
    'GET',
    '/pod/v1/connnection/list?status=pending_outgoing',
    'ConnectionsClient/getPendingConnections'
  )

// List pending inbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getInboundPendingConnections = () =>
  podRequest(
    'GET',
    '/pod/v1/connnection/list?status=pending_incoming',
    'ConnectionsClient/getInboundPendingConnections'
  )

// List all current connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAllConnections = () =>
  podRequest('GET', '/pod/v1/connnection/list?status=all', 'ConnectionsClient/getAllConnections')

// List accepted connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAcceptedConnections = () =>
  podRequest(
    'GET',
    '/pod/v1/connnection/list?status=accepted',
    'ConnectionsClient/getAcceptedConnections'
  )

// List rejected connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getRejectedConnections = () =>
  podRequest(
    'GET',
    '/pod/v1/connnection/list?status=rejected',
    'ConnectionsClient/getRejectedConnections'
  )

// List connection status for an array of users https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getConnections = (status, userIds) =>
  podRequest(
    'GET',
    `/pod/v1/connnection/list?status=all?userIds=${userIds}`,
    'ConnectionsClient/getConnections'
  )

// Accept connection request from a requesting user https://rest-api.symphony.com/docs/accepted-connection
ConnectionsClient.acceptConnectionRequest = userId => {
  const body = {
    userId: userId,
  }

  return podRequest(
    'POST',
    '/pod/v1/connnection/accept',
    'ConnectionsClient/acceptConnectionRequest',
    body
  )
}

// Reject connection request from a requesting user https://rest-api.symphony.com/docs/reject-connection
ConnectionsClient.rejectConnectionRequest = userId => {
  const body = {
    userId: userId,
  }

  return podRequest(
    'POST',
    '/pod/v1/connnection/reject',
    'ConnectionsClient/rejectConnectionRequest',
    body
  )
}

// Create a connection request to another user https://rest-api.symphony.com/docs/create-connection
ConnectionsClient.sendConnectionRequest = userId => {
  const body = {
    userId: userId,
  }

  return podRequest(
    'POST',
    '/pod/v1/connnection/create',
    'ConnectionsClient/sendConnectionRequest',
    body
  )
}

// Remove an existing connection to another user https://rest-api.symphony.com/docs/remove-connection
ConnectionsClient.removeConnection = userId =>
  podRequest(
    'POST',
    `/pod/v1/connnection/user/${userId}/remove`,
    'ConnectionsClient/removeConnection'
  )

// Get connection status for another user https://rest-api.symphony.com/docs/get-connection
ConnectionsClient.getConnectionRequestStatus = userId =>
  podRequest(
    'GET',
    `/pod/v1/connnection/user/${userId}/info`,
    'ConnectionsClient/getConnectionRequestStatus'
  )

module.exports = ConnectionsClient
