const mockConfig = {
  agentHost: 'agent.example.com',
  agentPort: 443,
  podHost: 'pod.example.com',
  podPort: 443,
}

jest.mock('../../lib/SymConfigLoader', () => ({
  SymConfig: mockConfig,
}))
jest.mock('../../lib/SymBotAuth', () => ({
  sessionAuthToken: 'session-token',
  kmAuthToken: 'key-manager-token',
}))
jest.mock('../../lib/DatafeedEventsService')

const https = require('https')
const nock = require('nock')
const SymBotClient = require('../../lib/SymBotClient')

describe('SymBotClient', () => {
  beforeAll(() => {
    jest.spyOn(https, 'request')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.each([
    // AdminClient
    ['adminListEnterpriseStreamsV2', [], 'post', '/pod/v2/admin/streams/list?skip=0&limit=100'],
    [
      'streamMembers',
      ['abc123'],
      'get',
      '/pod/v1/admin/stream/abc123/membership/list?skip=0&limit=1000',
    ],
    ['importMessages', [['one', 'two']], 'post', '/agent/v4/message/import'],
    ['suppressMessage', ['abc123'], 'post', '/pod/v1/admin/messagesuppression/abc123/suppress'],

    // AdminUserClient
    ['getUser', ['abc123'], 'get', '/pod/v2/admin/user/abc123'],
    ['listUsers', [], 'get', '/pod/v2/admin/user/list?skip=0&limit=1000'],

    // ConnectionsClient
    ['getPendingConnections', [], 'get', '/pod/v1/connnection/list?status=pending_outgoing'],
    ['getInboundPendingConnections', [], 'get', '/pod/v1/connnection/list?status=pending_incoming'],
    ['getAllConnections', [], 'get', '/pod/v1/connnection/list?status=all'],
    ['getAcceptedConnections', [], 'get', '/pod/v1/connnection/list?status=accepted'],
    ['getRejectedConnections', [], 'get', '/pod/v1/connnection/list?status=rejected'],
    [
      'getConnections',
      ['dummy', 'abc123'],
      'get',
      '/pod/v1/connnection/list?status=all?userIds=abc123',
    ],
    ['acceptConnectionRequest', [], 'post', '/pod/v1/connnection/accept'],
    ['rejectConnectionRequest', [], 'post', '/pod/v1/connnection/reject'],
    ['sendConnectionRequest', [], 'post', '/pod/v1/connnection/create'],
    ['removeConnection', ['abc123'], 'post', '/pod/v1/connnection/user/abc123/remove'],
    ['getConnectionRequestStatus', ['abc123'], 'get', '/pod/v1/connnection/user/abc123/info'],

    // FirehoseClient

    // getFirehoseEventsService
    // stopFirehoseEventsService

    // MessagesClient

    // sendMessage - multipart boundary header
    // sendMessageWithAttachment - multipart boundary header
    // forwardMessage - multipart boundary header
    // getAttachment - response is Base64
    ['getMessage', ['abc123'], 'get', '/agent/v1/message/abc123'],

    // OBOClient

    // oboAuthenticateByUserId
    ['oboGetAllConnections', [], 'get', '/pod/v1/connnection/list?status=all'],
    ['oboGetConnection', ['abc123'], 'get', '/pod/v1/connnection/user/abc123/info'],
    ['oboGetUserIMStreamId', [], 'post', '/pod/v1/admin/im/create'],
    // oboSendMessage - multipart boundary header

    // SignalsClient
    ['listSignals', [], 'get', '/agent/v1/signals/list?skip=0&limit=50'],
    ['getSignal', ['abc123'], 'get', '/agent/v1/signals/abc123/get'],
    ['createSignal', [], 'post', '/agent/v1/signals/create'],
    ['updateSignal', ['abc123'], 'post', '/agent/v1/signals/abc123/update'],
    ['deleteSignal', ['abc123'], 'post', '/agent/v1/signals/abc123/delete'],
    ['subscribeSignal', ['abc123'], 'post', '/agent/v1/signals/abc123/subscribe?pushed=false'],
    ['unsubscribeSignal', ['abc123'], 'post', '/agent/v1/signals/abc123/unsubscribe'],
    [
      'getSignalSubscribers',
      ['abc123'],
      'get',
      '/agent/v1/signals/abc123/subscribers?skip=0&limit=50',
    ],

    // StreamsClient
    ['getUserIMStreamId', [], 'post', '/pod/v1/im/create'],
    ['createRoom', [], 'post', '/pod/v3/room/create'],
    ['updateRoom', ['abc123'], 'post', '/pod/v3/room/abc123/update'],
    ['getRoomInfo', ['abc123'], 'get', '/pod/v3/room/abc123/info'],
    ['activateRoom', ['abc123'], 'post', '/pod/v1/room/abc123/setActive?active=true'],
    ['deactivateRoom', ['abc123'], 'post', '/pod/v1/room/abc123/setActive?active=false'],
    ['getRoomMembers', ['abc123'], 'get', '/pod/v2/room/abc123/membership/list'],
    ['addMemberToRoom', ['abc123'], 'post', '/pod/v1/room/abc123/membership/add'],
    ['removeMemberFromRoom', ['abc123'], 'post', '/pod/v1/room/abc123/membership/remove'],
    ['promoteUserToOwner', ['abc123'], 'post', '/pod/v1/room/abc123/membership/promoteOwner'],
    ['demoteUserFromOwner', ['abc123'], 'post', '/pod/v1/room/abc123/membership/demoteOwner'],
    ['searchRooms', [], 'post', '/pod/v3/room/search?skip=0&limit=100'],
    ['getUserStreams', [], 'post', '/pod/v1/streams/list?skip=0&limit=100'],

    // UsersClient
    ['getUserFromUsername', ['user123'], 'get', '/pod/v2/user?username=user123'],
    [
      'getUserFromEmail',
      ['example@example.com', true],
      'get',
      '/pod/v2/user?email=example@example.com&local=true',
    ],
    [
      'getUsersFromEmailList',
      ['example@example.com,example@example.org', true],
      'get',
      '/pod/v3/users?email=example@example.com,example@example.org&local=true',
    ],
    ['getUsersFromIdList', [1234, true], 'get', '/pod/v3/users?uid=1234&local=true'],
    [
      'searchUsers',
      ['query', true, 10, 100, 'filter'],
      'post',
      '/pod/v1/user/search?local=true&skip=10&limit=100',
    ],

    // PresenceClient
    ['getUserPresence', ['abc123'], 'get', '/pod/v3/user/abc123/presence?local=false'],
    ['setPresence', ['status'], 'post', '/pod/v2/user/presence'],
    ['registerInterestExtUser', [], 'post', '/pod/v1/user/presence/register'],
  ])('#%s', (methodName, args, verb, path) => {
    const host = path.substr(0, 6) === '/agent' ? mockConfig.agentHost : mockConfig.podHost

    it('handles success', async () => {
      nock(`https://${host}`)
        [verb](path)
        .reply(200, '{"status":"OK"}')

      await expect(SymBotClient[methodName](...args)).resolves.toEqual({
        status: 'OK',
      })

      expect(https.request.mock.calls).toMatchSnapshot()
    })

    it('handles failure', () => {
      nock(`https://${host}`)
        [verb](path)
        .replyWithError('Oh no')

      return expect(SymBotClient[methodName](...args)).rejects.toEqual({
        status: 'error',
      })
    })
  })

  describe('#getDatafeedEventsService', () => {
    it('creates and sets up instance', () => {
      const feedId = 'abc123'
      const messageHandler = jest.fn()
      const errorHandler = jest.fn()
      const feed = SymBotClient.getDatafeedEventsService(messageHandler, errorHandler, feedId)

      // call bound handler function
      feed.on.mock.calls[0][1]('hello')
      expect(messageHandler).toHaveBeenCalledWith('MESSAGE_RECEIVED', 'hello')

      expect(feed.start).toHaveBeenCalledWith(feedId)
      expect(feed.on).toHaveBeenCalledWith('error', errorHandler)
    })

    it('allows errorHandler and feedId to be omitted', () => {
      const messageHandler = jest.fn()
      const feed = SymBotClient.getDatafeedEventsService(messageHandler)

      // call bound handler function
      feed.on.mock.calls[0][1]('hello')
      expect(messageHandler).toHaveBeenCalledWith('MESSAGE_RECEIVED', 'hello')

      expect(feed.start).toHaveBeenCalledWith(undefined)
      expect(feed.on).not.toHaveBeenCalledWith(expect.any(String), undefined)
    })
  })

  describe('#stopDatafeedEventsService', () => {
    it('stops instance', () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {})
      const feed = SymBotClient.getDatafeedEventsService(jest.fn())
      SymBotClient.stopDatafeedEventsService()
      expect(feed.stop).toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
    })
  })
})
