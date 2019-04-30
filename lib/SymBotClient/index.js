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

const SymBotClient = {}

SymBotClient.PRESENTATIONML_FORMAT = MessagesClient.PRESENTATIONML_FORMAT
SymBotClient.MESSAGEML_FORMAT = MessagesClient.MESSAGEML_FORMAT

SymBotClient.sessionToken = {}

SymBotClient.initBot = pathToConfigFile => {
  return SymConfigLoader.loadFromFile(pathToConfigFile).then(SymConfig => {
    return SymBotAuth.authenticate(SymConfig).then(symAuth => {
      return {
        config: SymConfig,
        sessionAuthToken: symAuth.sessionAuthToken,
        kmAuthToken: symAuth.kmAuthToken,
      }
    })
  })
}

SymBotClient.getBotUser = () => SymBotAuth.botUser

/* AdminClient Services */

SymBotClient.adminListEnterpriseStreamsV2 = AdminClient.adminListEnterpriseStreamsV2
SymBotClient.streamMembers = AdminClient.streamMembers
SymBotClient.importMessages = AdminClient.importMessages
SymBotClient.suppressMessage = AdminClient.suppressMessage

/* AdminUserClient Services */

SymBotClient.getUser = AdminUserClient.getUser
SymBotClient.listUsers = AdminUserClient.listUsers

/* ConnectionsClient Services */

SymBotClient.getPendingConnections = ConnectionsClient.getPendingConnections
SymBotClient.getInboundPendingConnections = ConnectionsClient.getInboundPendingConnections
SymBotClient.getAllConnections = ConnectionsClient.getAllConnections
SymBotClient.getAcceptedConnections = ConnectionsClient.getAcceptedConnections
SymBotClient.getRejectedConnections = ConnectionsClient.getRejectedConnections
SymBotClient.getConnections = ConnectionsClient.getConnections
SymBotClient.acceptConnectionRequest = ConnectionsClient.acceptConnectionRequest
SymBotClient.rejectConnectionRequest = ConnectionsClient.rejectConnectionRequest
SymBotClient.sendConnectionRequest = ConnectionsClient.sendConnectionRequest
SymBotClient.removeConnection = ConnectionsClient.removeConnection
SymBotClient.getConnectionRequestStatus = ConnectionsClient.getConnectionRequestStatus

/* DatafeedClient Services */

let datafeedInstance
SymBotClient.getDatafeedEventsService = (messageHandler, errorHandler, feedId) => {
  datafeedInstance = new DatafeedEventsService()
  // pass string as first param to handler for back compat
  datafeedInstance.on('message', messageHandler.bind(null, 'MESSAGE_RECEIVED'))
  datafeedInstance.on('error', errorHandler)
  datafeedInstance.start(feedId)
  return datafeedInstance
}
// todo: remove this method and the datafeedInstance variable in the next major version
SymBotClient.stopDatafeedEventsService = () => {
  console.warn(
    'stopDatafeedEventsService is deprecated. See https://github.com/SymphonyPlatformSolutions/symphony-api-client-node#release-notes'
  )
  datafeedInstance.stop()
}

/* FirehoseClient Services */

SymBotClient.getFirehoseEventsService = FirehoseEventsService.initService
SymBotClient.stopFirehoseEventsService = FirehoseEventsService.stopService

/* MessagesClient Services */

SymBotClient.sendMessage = MessagesClient.sendMessage
SymBotClient.sendMessageWithAttachment = MessagesClient.sendMessageWithAttachment
SymBotClient.forwardMessage = MessagesClient.forwardMessage
SymBotClient.getAttachment = MessagesClient.getAttachment
SymBotClient.getMessage = MessagesClient.getMessage

/* On Behalf Of - OBOClient Services */

SymBotClient.oboAuthenticateByUserId = SymBotAuth.oboAuthenticateByUserId
SymBotClient.oboGetAllConnections = OBOClient.oboGetAllConnections
SymBotClient.oboGetConnection = OBOClient.oboGetConnection
SymBotClient.oboGetUserIMStreamId = OBOClient.oboGetUserIMStreamId
SymBotClient.oboSendMessage = OBOClient.oboSendMessage

/* SignalsClient Services */

SymBotClient.listSignals = SignalsClient.listSignals
SymBotClient.getSignal = SignalsClient.getSignal
SymBotClient.createSignal = SignalsClient.createSignal
SymBotClient.updateSignal = SignalsClient.updateSignal
SymBotClient.deleteSignal = SignalsClient.deleteSignal
SymBotClient.subscribeSignal = SignalsClient.subscribeSignal
SymBotClient.unsubscribeSignal = SignalsClient.unsubscribeSignal
SymBotClient.getSignalSubscribers = SignalsClient.getSignalSubscribers

/* StreamsClient Services */

SymBotClient.getUserIMStreamId = StreamsClient.getUserIMStreamId
SymBotClient.createRoom = StreamsClient.createRoom
SymBotClient.updateRoom = StreamsClient.updateRoom
SymBotClient.getRoomInfo = StreamsClient.getRoomInfo
SymBotClient.activateRoom = StreamsClient.activateRoom
SymBotClient.deactivateRoom = StreamsClient.deactivateRoom
SymBotClient.getRoomMembers = StreamsClient.getRoomMembers
SymBotClient.addMemberToRoom = StreamsClient.addMemberToRoom
SymBotClient.removeMemberFromRoom = StreamsClient.removeMemberFromRoom
SymBotClient.promoteUserToOwner = StreamsClient.promoteUserToOwner
SymBotClient.demoteUserFromOwner = StreamsClient.demoteUserFromOwner
SymBotClient.searchRooms = StreamsClient.searchRooms
SymBotClient.getUserStreams = StreamsClient.getUserStreams

/* UsersClient Services */

SymBotClient.getUserFromUsername = UsersClient.getUserFromUsername
SymBotClient.getUserFromEmail = UsersClient.getUserFromEmail
SymBotClient.getUsersFromEmailList = UsersClient.getUsersFromEmailList
SymBotClient.getUsersFromIdList = UsersClient.getUsersFromIdList
SymBotClient.searchUsers = UsersClient.searchUsers

/* Presence Services */

SymBotClient.getUserPresence = PresenceClient.getUserPresence
SymBotClient.setPresence = PresenceClient.setPresence
SymBotClient.registerInterestExtUser = PresenceClient.registerInterestExtUser

/* Other Services */

SymBotClient.setDebugMode = mode => {
  SymBotAuth.debug = mode
  console.log(`[DEBUG] Debug mode turned ${mode ? 'on' : 'off'}`)
}

module.exports = SymBotClient
