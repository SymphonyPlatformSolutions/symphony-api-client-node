jest.mock('../../lib/SymConfigLoader', () => ({
  SymConfig: {
    agentHost: 'agent.example.com',
    getAgentHost: async () => 'agent.example.com',
    rotateAgent: async () => { }
  },
}))
jest.mock('../../lib/SymBotAuth', () => ({
  sessionAuthToken: 'session-token',
  kmAuthToken: 'key-manager-token',
  botUser: { displayName: 'test' },
}))

const nock = require('nock')
const DatafeedEventsService = require('../../lib/DatafeedEventsService')

const mockBody = [
  {
    type: 'MESSAGESENT',
    initiator: { user: { userId: 123 } },
    payload: {
      messageSent: {
        message: {
          message: '<div data-format="PresentationML" data-version="2.0">Hello World</div>',
        },
      },
    },
  },
  {
    type: 'USERJOINEDROOM',
    initiator: { user: { userId: 234 } },
    payload: {
      userJoinedRoom: {
        stream: { streamId: 'abc123', streamType: 'ROOM' },
        affectedUser: { userId: 123 },
      },
    },
  },
]

const parsedMessages = [
  {
    message: '<div data-format="PresentationML" data-version="2.0">Hello World</div>',
    messageText: 'Hello World',
  },
]

function mockCreate() {
  return nock('https://agent.example.com').post(`/agent/v4/datafeed/create`)
}

function mockRead(id) {
  return nock('https://agent.example.com').get(`/agent/v4/datafeed/${id}/read`)
}

function initFeed(messageHandler, id, errorHandler) {
  const feed = new DatafeedEventsService()
  feed.on('message', messageHandler)
  feed.on('error', errorHandler || (err => console.error('Unhandled feed error', err)))
  feed.start(id)
  return feed
}

function stopFeed(feed) {
  // suppress stop bot log message
  console.log.mockImplementationOnce(() => { })
  feed.stop()
}

function mockHasBeenCalled(mock) {
  return new Promise(resolve => {
    mock.mockImplementationOnce(resolve)
  })
}

describe('DatafeedEventsService', () => {
  const id = 'feed123'

  beforeAll(() => {
    jest.spyOn(process, 'on')
    jest.spyOn(process, 'exit').mockImplementation(() => { })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log')
    jest.spyOn(console, 'warn')
  })

  afterEach(() => {
    nock.isDone()
    console.log.mockRestore()
    console.warn.mockRestore()
  })

  it('recreates existing datafeed', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    stopFeed(feed)
    await mockHasBeenCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('creates new datafeed', async () => {
    mockCreate().reply(200, { id })
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler)
    stopFeed(feed)
    await mockHasBeenCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('corrects wrongly passed feedId', () => {
    const feed = new DatafeedEventsService()

    expect(feed._fixFeedId(id)).toEqual(id);
    expect(feed._fixFeedId('undefined')).toEqual(null);
    expect(feed._fixFeedId('null')).toEqual(null);
    expect(feed._fixFeedId(null)).toEqual(null);
  })

  it('continues reading when feed responds or times out', async () => {
    mockRead(id)
      .times(2)
      .reply(204)
    mockRead(id)
      .times(2)
      .reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    await mockHasBeenCalled(messageHandler)
    stopFeed(feed)
    await mockHasBeenCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledTimes(2)
  })

  it('emits on user added', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const userJoinedHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    feed.on('userjoinedroom', userJoinedHandler)
    stopFeed(feed)
    await mockHasBeenCalled(userJoinedHandler)

    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
    expect(userJoinedHandler).toHaveBeenCalledWith([mockBody[1]])
  })

  it('emits on create connection', async () => {
    mockCreate().reply(200, { id })
    mockRead(id).reply(204)

    const messageHandler = jest.fn()
    const createdHandler = jest.fn()
    const feed = initFeed(messageHandler)
    feed.on('created', createdHandler)
    stopFeed(feed)
    await mockHasBeenCalled(createdHandler)

    expect(createdHandler).toHaveBeenCalledWith(id)
  })

  it('emits on stopping and stopped events', async () => {
    mockCreate().reply(200, { id })
    mockRead(id).reply(204)

    const messageHandler = jest.fn()
    const stoppingHandler = jest.fn()
    const stoppedHandler = jest.fn()
    const feed = initFeed(messageHandler)
    feed.on('stopping', stoppingHandler)
    feed.on('stopped', stoppedHandler)
    stopFeed(feed);
    expect(stoppingHandler).toHaveBeenCalled()

    await mockHasBeenCalled(stoppedHandler)
  })

  it('emits on read connection error', async () => {
    mockRead(id).replyWithError('Network error')

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, id, errorHandler)
    await mockHasBeenCalled(errorHandler)

    expect(messageHandler).not.toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalledWith({ status: 'error' })
  })

  it('reconnects on read HTTP 400 error, emits on 404', async () => {
    mockRead(id).reply(400)
    mockCreate().reply(200, { id })
    mockRead(id).reply(200, mockBody)
    mockRead(id).reply(404)

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, id, errorHandler)
    await mockHasBeenCalled(messageHandler)
    await mockHasBeenCalled(errorHandler)

    expect(errorHandler).toHaveBeenCalledWith({ status: 'error', statusCode: 404 })
    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('triggers shutdown procedure on SIGINT', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    feed.registerShutdownHooks()
    console.log.mockImplementation(jest.fn())

    process.emit('SIGINT', {}, 0)
    await mockHasBeenCalled(process.exit)
  })

  it('only triggers shutdown procedure once', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    feed.registerShutdownHooks()
    console.log.mockImplementation(jest.fn())

    process.emit('SIGINT', {}, 0)
    process.emit('SIGINT', {}, 0)
    await mockHasBeenCalled(process.exit)
    expect(process.exit).toHaveBeenCalledTimes(1)
  })

  it('emits stopping and stopped on SIGINT', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    feed.registerShutdownHooks()
    console.log.mockImplementation(jest.fn())

    const stoppedHandler = jest.fn()
    feed.on('stopped', stoppedHandler)
    const stoppingHandler = jest.fn()
    feed.on('stopping', stoppingHandler)

    process.emit('SIGINT', {}, 0)
    await mockHasBeenCalled(process.exit)

    expect(stoppingHandler).toHaveBeenCalled()
    expect(stoppedHandler).toHaveBeenCalled()
  })

  it('when shutdown event handler attached emits a shutdown event and does not exit on SIGINT', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    feed.registerShutdownHooks()
    console.log.mockImplementation(jest.fn())

    const shutdownHandler = jest.fn()
    feed.on('shutdown', shutdownHandler)

    process.emit('SIGINT', {}, 0)
    await mockHasBeenCalled(shutdownHandler)
    expect(process.exit).not.toHaveBeenCalled()
  })

  it('warns if no handlers registered', async () => {
    console.warn.mockImplementation(jest.fn())
    const feed = new DatafeedEventsService()
    feed.start()

    expect(console.warn).toHaveBeenCalledTimes(2)
  })

  it('checks retry wait interval calculation', () => {
    const feed = new DatafeedEventsService()

    let retryCount = 2
    let maxWaitInterval = 64000 // 64 seconds
    let waitInterval = feed._getExponentialWaitInterval(retryCount, maxWaitInterval)

    // second try must be 4 seconds
    expect(waitInterval).toEqual(4000);
  })
})
