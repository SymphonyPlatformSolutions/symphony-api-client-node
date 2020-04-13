const { podRequest } = require('../Request/clients')
const SymConfigLoader = require('../SymConfigLoader')

const StreamsClient = {}

// Get StreamID for user(s) using https://rest-api.symphony.com/docs/create-im-or-mim
StreamsClient.getUserIMStreamId = userIDs =>
  podRequest('POST', SymConfigLoader.SymConfig.pathPrefix + '/pod/v1/im/create', 'StreamsClient/getUserIMStreamId', userIDs)

// Create room using https://rest-api.symphony.com/docs/create-room-v3
StreamsClient.createRoom = (
  room,
  description,
  keywords,
  membersCanInvite = true,
  discoverable = true,
  anyoneCanJoin = false,
  readOnly = false,
  copyProtected = false,
  crossPod = false,
  viewHistory = false
) => {
  const body = {
    name: room,
    description: description,
    keywords: keywords,
    membersCanInvite: membersCanInvite,
    discoverable: discoverable,
    public: anyoneCanJoin,
    readOnly: readOnly,
    copyProtected: copyProtected,
    crossPod: crossPod,
    viewHistory: viewHistory
  }

  return podRequest('POST', SymConfigLoader.SymConfig.pathPrefix + '/pod/v3/room/create', 'StreamsClient/createRoom', body)
}

// Update room using https://rest-api.symphony.com/docs/update-room-v3
StreamsClient.updateRoom = (
  streamId,
  room,
  description,
  keywords,
  membersCanInvite,
  discoverable,
  anyoneCanJoin,
  readOnly,
  copyProtected,
  crossPod,
  viewHistory
) => {
  const body = {
    name: room,
    description: description,
    keywords: keywords,
    membersCanInvite: membersCanInvite,
    discoverable: discoverable,
    public: anyoneCanJoin,
    readOnly: readOnly,
    copyProtected: copyProtected,
    crossPod: crossPod,
    viewHistory: viewHistory
  }

  return podRequest('POST', SymConfigLoader.SymConfig.pathPrefix + `/pod/v3/room/${streamId}/update`, 'StreamsClient/updateRoom', body)
}

// Room Information using https://rest-api.symphony.com/docs/room-info-v3
StreamsClient.getRoomInfo = streamId =>
  podRequest('GET', SymConfigLoader.SymConfig.pathPrefix + `/pod/v3/room/${streamId}/info`, 'StreamsClient/getRoomInfo')

// Re-Activate Room using https://rest-api.symphony.com/docs/de-or-re-activate-room
StreamsClient.activateRoom = streamId =>
  podRequest('POST', SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/setActive?active=true`, 'StreamsClient/activateRoom')

// De-Activate Room using https://rest-api.symphony.com/docs/de-or-re-activate-room
StreamsClient.deactivateRoom = streamId =>
  podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/setActive?active=false`,
    'StreamsClient/deactivateRoom'
  )

// Room Members using https://rest-api.symphony.com/docs/room-members
StreamsClient.getRoomMembers = streamId =>
  podRequest('GET', SymConfigLoader.SymConfig.pathPrefix + `/pod/v2/room/${streamId}/membership/list`, 'StreamsClient/getRoomMembers')

// Add Member to existing room using https://rest-api.symphony.com/docs/add-member
StreamsClient.addMemberToRoom = (streamId, userId) => {
  const body = {
    id: userId
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/membership/add`,
    'StreamsClient/addMemberToRoom',
    body
  )
}

// Remove Member to existing room using https://rest-api.symphony.com/docs/remove-member
StreamsClient.removeMemberFromRoom = (streamId, userId) => {
  const body = {
    id: userId
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/membership/remove`,
    'StreamsClient/removeMemberFromRoom',
    body
  )
}

// Promote Member to owner of room using https://rest-api.symphony.com/docs/promote-owner
StreamsClient.promoteUserToOwner = (streamId, userId) => {
  const body = {
    id: userId
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/membership/promoteOwner`,
    'StreamsClient/promoteUserToOwner',
    body
  )
}

// Demote Member from owner of room using https://rest-api.symphony.com/docs/promote-owner
StreamsClient.demoteUserFromOwner = (streamId, userId) => {
  const body = {
    id: userId
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/room/${streamId}/membership/demoteOwner`,
    'StreamsClient/demoteUserFromOwner',
    body
  )
}

// Search Rooms using https://rest-api.symphony.com/docs/search-rooms-v3
StreamsClient.searchRooms = (
  skip = 0,
  limit = 100,
  query,
  labels,
  active = true,
  includePrivateRooms = false,
  creator,
  owner,
  member,
  sortOrder = 'RELEVANCE'
) => {
  const body = {
    query: query,
    labels: labels,
    active: active,
    private: includePrivateRooms,
    creator: creator,
    owner: owner,
    member: member,
    sortOrder: sortOrder
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v3/room/search?skip=${skip}&limit=${limit}`,
    'StreamsClient/searchRooms',
    body
  )
}

// List User Streams using https://rest-api.symphony.com/docs/list-user-streams
StreamsClient.getUserStreams = (skip = 0, limit = 100, streamTypes, includeInactiveStreams) => {
  const body = {
    streamTypes: streamTypes,
    includeInactiveStreams: includeInactiveStreams
  }

  return podRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/streams/list?skip=${skip}&limit=${limit}`,
    'StreamsClient/getUserStreams',
    body
  )
}

module.exports = StreamsClient
