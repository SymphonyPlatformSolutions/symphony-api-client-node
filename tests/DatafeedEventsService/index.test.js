jest.mock('../../lib/SymConfigLoader', () => ({
  SymConfig: { agentHost: 'agent.example.com' },
}))
jest.mock('../../lib/SymBotAuth', () => ({
  sessionAuthToken: 'session-token',
  kmAuthToken: 'key-manager-token',
  botUser: { displayName: 'test' },
}))

const nock = require('nock')
const Datafeed = require('../../lib/DatafeedEventsService')

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

function initFeed(messageHandler, id, errorHandler) {
  const feed = new Datafeed()
  feed.on('message', messageHandler)
  feed.on('error', errorHandler || (err => console.error('Unhandled feed error', err)))
  feed.start(id)
  return feed
}

function stopFeed(feed) {
  console.log.mockImplementationOnce(() => {})
  feed.stop()
}

function mockCalled(mock) {
  return new Promise(resolve => {
    mock.mockImplementationOnce(resolve)
  })
}

describe('DatafeedEventsService', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => nock.isDone())

  it('recreates existing datafeed', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    stopFeed(feed)
    await mockCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('creates new datafeed', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .post(`/agent/v4/datafeed/create`)
      .reply(200, { id })
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler)
    stopFeed(feed)
    await mockCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })

  it('continues reading when feed responds or times out', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .times(2)
      .reply(204)
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .times(2)
      .reply(200, mockBody)

    const messageHandler = jest.fn()
    const feed = initFeed(messageHandler, id)
    await mockCalled(messageHandler)
    stopFeed(feed)
    await mockCalled(messageHandler)

    expect(messageHandler).toHaveBeenCalledTimes(2)
  })

  it('emits on create connection', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/create`)
      .replyWithError('Network error')

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, null, errorHandler)
    await mockCalled(errorHandler)

    expect(messageHandler).not.toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalledWith({ status: 'error' })
  })

  it('emits on read connection error', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .replyWithError('Network error')

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, id, errorHandler)
    await mockCalled(errorHandler)

    expect(messageHandler).not.toHaveBeenCalled()
    expect(errorHandler).toHaveBeenCalledWith({ status: 'error' })
  })

  it('reconnects on read HTTP 400 error, emits on 500', async () => {
    const id = 'abc123'
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .reply(400)
    nock('https://agent.example.com')
      .post(`/agent/v4/datafeed/create`)
      .reply(200, { id })
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .reply(200, mockBody)
    nock('https://agent.example.com')
      .get(`/agent/v4/datafeed/${id}/read`)
      .reply(500)

    const messageHandler = jest.fn()
    const errorHandler = jest.fn()
    initFeed(messageHandler, id, errorHandler)
    await mockCalled(messageHandler)
    await mockCalled(errorHandler)

    expect(errorHandler).toHaveBeenCalledWith({ status: 'error', statusCode: 500 })
    expect(messageHandler).toHaveBeenCalledWith(parsedMessages)
  })
})
