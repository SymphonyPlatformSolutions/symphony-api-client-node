const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const AdminClient = require('../AdminClient')
const AdminUserClient = require('../AdminUserClient')
const ConnectionsClient = require('../ConnectionsClient')
const DatafeedEventsService = require('../DatafeedEventsService')
const FirehoseEventsService = require('../FirehoseEventsService')
const MessagesClient = require('../MessagesClient')
const OBOClient = require('../OBOClient')
const SignalsClient = require('../SignalsClient')
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

/* AdminClient Services */

SymBotClient.adminListEnterpriseStreamsV2 = (streamTypes, scope, origin, privacy, status, startDate, endDate, skip, limit) => {
  var defer = Q.defer()

  AdminClient.adminListEnterpriseStreamsV2(streamTypes, scope, origin, privacy, status, startDate, endDate, skip, limit).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.streamMembers = (id, skip, limit) => {
  var defer = Q.defer()

  AdminClient.streamMembers(id, skip, limit).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.importMessages = (messageList) => {
  var defer = Q.defer()

  AdminClient.importMessages(messageList).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.suppressMessage = (id) => {
  var defer = Q.defer()

  AdminClient.suppressMessage(id).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* AdminUserClient Services */

SymBotClient.getUser = (id) => {
  var defer = Q.defer()

  AdminUserClient.getUser(id).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.listUsers = (skip, limit) => {
  var defer = Q.defer()

  AdminUserClient.listUsers(skip, limit).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* ConnectionsClient Services */

SymBotClient.getPendingConnections = (status) => {
  var defer = Q.defer()

  ConnectionsClient.getPendingConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getInboundPendingConnections = (status) => {
  var defer = Q.defer()

  ConnectionsClient.getInboundPendingConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getAllConnections = (status) => {
  var defer = Q.defer()

  ConnectionsClient.getAllConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getAcceptedConnections = (status) => {
  var defer = Q.defer()

  ConnectionsClient.getAcceptedConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getRejectedConnections = (status) => {
  var defer = Q.defer()

  ConnectionsClient.getRejectedConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getConnections = (status, userIds) => {
  var defer = Q.defer()

  ConnectionsClient.getConnections(status, userIds).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.acceptConnectionRequest = (userId) => {
  var defer = Q.defer()

  ConnectionsClient.acceptConnectionRequest(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.rejectConnectionRequest = (userId) => {
  var defer = Q.defer()

  ConnectionsClient.rejectConnectionRequest(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.sendConnectionRequest = (userId) => {
  var defer = Q.defer()

  ConnectionsClient.sendConnectionRequest(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.removeConnection = (userId) => {
  var defer = Q.defer()

  ConnectionsClient.removeConnection(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getConnectionRequestStatus = (userId) => {
  var defer = Q.defer()

  ConnectionsClient.getConnectionRequestStatus(userId).then((res) => {
    defer.resolve(res)
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

/* FirehoseClient Services */

SymBotClient.getFirehoseEventsService = (subscriberCallback) => {
  FirehoseEventsService.initService(subscriberCallback)
}

SymBotClient.stopFirehoseEventsService = () => {
  FirehoseEventsService.stopService()
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

/* On Behalf Of - OBOClient Services */
SymBotClient.oboGetAllConnections = (status) => {
  var defer = Q.defer()

  OBOClient.oboGetAllConnections(status).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.oboGetConnection = (userId) => {
  var defer = Q.defer()

  OBOClient.oboGetConnection(userId).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.oboGetUserIMStreamId = (userIds) => {
  var defer = Q.defer()

  OBOClient.oboGetUserIMStreamId(userIds).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.oboSendMessage = (conversationId, message, data, format) => {
  var defer = Q.defer()

  OBOClient.oboSendMessage(conversationId, message, data, format).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

/* SignalsClient Services */

SymBotClient.listSignals = (skip, limit) => {
  var defer = Q.defer()

  SignalsClient.listSignals(skip, limit).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getSignal = (id) => {
  var defer = Q.defer()

  SignalsClient.getSignal(id).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.createSignal = (name, query, visibleOnProfile, companyWide) => {
  var defer = Q.defer()

  SignalsClient.createSignal(name, query, visibleOnProfile, companyWide).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.updateSignal = (id, name, query, visibleOnProfile, companyWide) => {
  var defer = Q.defer()

  SignalsClient.updateSignal(id, name, query, visibleOnProfile, companyWide).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.deleteSignal = (id) => {
  var defer = Q.defer()

  SignalsClient.deleteSignal(id).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.subscribeSignal = (id, userIds, userCanUnsubscribe) => {
  var defer = Q.defer()

  SignalsClient.subscribeSignal(id, userIds, userCanUnsubscribe).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.unsubscribeSignal = (id, userIds) => {
  var defer = Q.defer()

  SignalsClient.unsubscribeSignal(id, userIds).then((res) => {
    defer.resolve(res)
  })

  return defer.promise
}

SymBotClient.getSignalSubscribers = (id, skip, limit) => {
  var defer = Q.defer()

  SignalsClient.getSignalSubscribers(id, skip, limit).then((res) => {
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
