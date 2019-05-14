jest.mock('../../lib/SymConfigLoader', () => ({
  SymConfig: { agentHost: 'agent.example.com' },
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
  console.log.mockImplementationOnce(() => {})
  feed.stop()
}

function mockHasBeenCalled(mock) {
  return new Promise(resolve => {
    mock.mockImplementationOnce(resolve)
  })
}

describe('DatafeedEventsService', () => {
  const id = 'abc123'

  beforeAll(() => {
    jest.spyOn(process, 'on')
    jest.spyOn(process, 'exit').mockImplementation(() => {})
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

  it('emits on create connection', async () => {
    mockCreate().replyWithError('Network error')

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, null, errorHandler)
    await mockHasBeenCalled(errorHandler)

    expect(messageHandler).not.toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalledWith({ status: 'error' })
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

  it('reconnects on read HTTP 400 error, emits on 500', async () => {
    mockRead(id).reply(400)
    mockCreate().reply(200, { id })
    mockRead(id).reply(200, mockBody)
    mockRead(id).reply(500)

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, id, errorHandler)
    await mockHasBeenCalled(messageHandler)
    await mockHasBeenCalled(errorHandler)

    expect(errorHandler).toHaveBeenCalledWith({ status: 'error', statusCode: 500 })
    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('triggers shutdown procedure on SIGINT', async () => {
    mockRead(id).reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    stopFeed(feed)
    feed.registerShutdownHooks()
    console.log.mockImplementation(jest.fn())

    process.emit('SIGINT', {}, 0)
    await mockHasBeenCalled(process.exit)
  })

  it('warns if no handlers registered', async () => {
    console.warn.mockImplementation(jest.fn())
    const feed = new DatafeedEventsService()
    feed.start()

    expect(console.warn).toHaveBeenCalledTimes(2)
  })
})
