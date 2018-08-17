const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const DatafeedEventsService = require('../DatafeedEventsService')
const MessagesClient = require('../MessagesClient')
const StreamsClient = require('../StreamsClient')
const UsersClient = require('../UsersClient')
const PresenceClient = require('../PresenceClient')
const Q = require('kew')

var SymBotClient = {}

SymBotClient.PRESENTATIONML_FORMAT = MessagesClient.PRESENTATIONML_FORMAT
SymBotClient.MESSAGEML_FORMAT = MessagesClient.MESSAGEML_FORMAT

SymBotClient.sessionToken = {}

SymBotClient.initBot = (pathToConfigFile) => {
  var defer = Q.defer()

  SymConfigLoader.loadFromFile(pathToConfigFile).then(SymConfig => {
    SymBotAuth.authenticate(SymConfig).then((symAuth) => {
      defer.resolve({ 'config': SymConfig, 'sessionAuthToken': symAuth.sessionAuthToken, 'kmAuthToken': symAuth.kmAuthToken })
    })
  }).fail((err) => {
    defer.reject(err)
  })

  return defer.promise
}

/* DatafeedClient Services */

SymBotClient.getDatafeedEventsService = (subscriberCallback) => {
  DatafeedEventsService.initService(subscriberCallback)
}

SymBotClient.stopDatafeedEventsService = () => {
  DatafeedEventsService.stopService()
}

/* MessagesClient Services */

SymBotClient.sendMessage = (conversationId, message, data, format) => {
  var defer = Q.defer()

  MessagesClient.sendMessage(conversationId, message, data, format).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.forwardMessage = (conversationId, message, data) => {
  var defer = Q.defer()

  MessagesClient.forwardMessage(conversationId, message, data).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getAttachment = (streamId, attachmentId, messageId) => {
  var defer = Q.defer()

  MessagesClient.getAttachment(streamId, attachmentId, messageId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* StreamsClient Services */

SymBotClient.getUserIMStreamId = (userId) => {
  var defer = Q.defer()

  StreamsClient.getUserIMStreamId(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.createRoom = (room, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory) => {
  var defer = Q.defer()

  StreamsClient.createRoom(room, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.updateRoom = (streamId, room, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory) => {
  var defer = Q.defer()

  StreamsClient.updateRoom(streamId, room, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getRoomInfo = (streamId) => {
  var defer = Q.defer()

  StreamsClient.getRoomInfo(streamId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.activateRoom = (streamId) => {
  var defer = Q.defer()

  StreamsClient.activateRoom(streamId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.deactivateRoom = (streamId) => {
  var defer = Q.defer()

  StreamsClient.deactivateRoom(streamId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getRoomMembers = (streamId) => {
  var defer = Q.defer()

  StreamsClient.getRoomMembers(streamId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.addMemberToRoom = (streamId, userId) => {
  var defer = Q.defer()

  StreamsClient.addMemberToRoom(streamId, userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.removeMemberFromRoom = (streamId, userId) => {
  var defer = Q.defer()

  StreamsClient.removeMemberFromRoom(streamId, userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.promoteUserToOwner = (streamId, userId) => {
  var defer = Q.defer()

  StreamsClient.promoteUserToOwner(streamId, userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.demoteUserFromOwner = (streamId, userId) => {
  var defer = Q.defer()

  StreamsClient.demoteUserFromOwner(streamId, userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.searchRooms = (skip, limit, query, labels, active, includePrivateRooms, creator, owner, member, sortOrder) => {
  var defer = Q.defer()

  StreamsClient.searchRooms(skip, limit, query, labels, active, includePrivateRooms, creator, owner, member, sortOrder).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getUserStreams = (skip, limit, streamTypes, includeInactiveStreams) => {
  var defer = Q.defer()

  StreamsClient.getUserStreams(skip, limit, streamTypes, includeInactiveStreams).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* UsersClient Services */

SymBotClient.getUserFromUsername = (username) => {
  var defer = Q.defer()

  UsersClient.getUserFromUsername(username).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getUserFromEmail = (email, local) => {
  var defer = Q.defer()

  UsersClient.getUserFromEmail(email, local).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getUsersFromEmailList = (emailList, local) => {
  var defer = Q.defer()

  UsersClient.getUsersFromEmailList(emailList, local).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getUsersFromIdList = (idList, local) => {
  var defer = Q.defer()

  UsersClient.getUsersFromIdList(idList, local).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.searchUsers = (query, local, skip, limit, filter) => {
  var defer = Q.defer()

  UsersClient.searchUsers(query, local, skip, limit, filter).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* Presence Services */

SymBotClient.getUserPresence = (userId, local) => {
  var defer = Q.defer()

  PresenceClient.getUserPresence(userId, local).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.setPresence = (status) => {
  var defer = Q.defer()

  PresenceClient.setPresence(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.registerInterestExtUser = (idList) => {
  var defer = Q.defer()

  PresenceClient.registerInterestExtUser(idList).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* Other Services */

SymBotClient.setDebugMode = (mode) => {
  SymBotAuth.debug = mode
  if (SymBotAuth.debug) {
    console.log('[DEBUG] Debug mode turned on')
  } else {
    console.log('[DEBUG] Debug mode turned off')
  }
}

module.exports = SymBotClient
