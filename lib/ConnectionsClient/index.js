const { podRequest } = require('../Request/clients')

const ConnectionsClient = {}

ConnectionsClient.PENDING_INCOMING = 'Pending Incoming'
ConnectionsClient.PENDING_OUTGOING = 'Pending Outgoing'
ConnectionsClient.ACCEPTED = 'Accepted'
ConnectionsClient.REJECTED = 'Rejected'
ConnectionsClient.ALL = 'All'

// List pending outbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getPendingConnections = (sessionToken) =>
  podRequest(
    'GET',
    '/pod/v1/connection/list?status=pending_outgoing',
    'ConnectionsClient/getPendingConnections',
    undefined,
    sessionToken
  )

// List pending inbound connection requests using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getInboundPendingConnections = (sessionToken) =>
  podRequest(
    'GET',
    '/pod/v1/connection/list?status=pending_incoming',
    'ConnectionsClient/getInboundPendingConnections',
    undefined,
    sessionToken
  )

// List all current connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAllConnections = (sessionToken) =>
  podRequest(
    'GET',
    '/pod/v1/connection/list?status=all',
    'ConnectionsClient/getAllConnections',
    undefined,
    sessionToken
  )

// List accepted connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getAcceptedConnections = (sessionToken) =>
  podRequest(
    'GET',
    '/pod/v1/connection/list?status=accepted',
    'ConnectionsClient/getAcceptedConnections',
    undefined,
    sessionToken
  )

// List rejected connections using https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getRejectedConnections = (sessionToken) =>
  podRequest(
    'GET',
    '/pod/v1/connection/list?status=rejected',
    'ConnectionsClient/getRejectedConnections',
    undefined,
    sessionToken
  )

// List connection status for an array of users https://rest-api.symphony.com/docs/list-connections
ConnectionsClient.getConnections = (status, userIds, sessionToken) =>
  podRequest(
    'GET',
    `/pod/v1/connection/list?status=all?userIds=${ userIds }`,
    'ConnectionsClient/getConnections',
    undefined,
    sessionToken
  )

// Accept connection request from a requesting user https://rest-api.symphony.com/docs/accepted-connection
ConnectionsClient.acceptConnectionRequest = (userId, sessionToken) =>
  podRequest(
    'POST',
    '/pod/v1/connection/accept',
    'ConnectionsClient/acceptConnectionRequest',
    { userId },
    sessionToken
  )

// Reject connection request from a requesting user https://rest-api.symphony.com/docs/reject-connection
ConnectionsClient.rejectConnectionRequest = (userId, sessionToken) =>
  podRequest(
    'POST',
    '/pod/v1/connection/reject',
    'ConnectionsClient/rejectConnectionRequest',
    { userId },
    sessionToken
  )

// Create a connection request to another user https://rest-api.symphony.com/docs/create-connection
ConnectionsClient.sendConnectionRequest = (userId, sessionToken) =>
  podRequest(
    'POST',
    '/pod/v1/connection/create',
    'ConnectionsClient/sendConnectionRequest',
    { userId },
    sessionToken
  )

// Remove an existing connection to another user https://rest-api.symphony.com/docs/remove-connection
ConnectionsClient.removeConnection = (userId, sessionToken) =>
  podRequest(
    'POST',
    `/pod/v1/connection/user/${ userId }/remove`,
    'ConnectionsClient/removeConnection',
    undefined,
    sessionToken
  )

// Get connection status to another user https://rest-api.symphony.com/docs/get-connection
ConnectionsClient.getConnectionRequestStatus = (userId, sessionToken) =>
  podRequest(
    'GET',
    `/pod/v1/connection/user/${ userId }/info`,
    'ConnectionsClient/getConnectionRequestStatus',
    undefined,
    sessionToken
  )

module.exports = ConnectionsClient
