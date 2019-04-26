jest.mock('../../lib/SymConfigLoader', () => ({
  SymConfig: { keyAuthHost: 'keyauth.example.com' },
}))
jest.mock('../../lib/SymBotAuth', () => ({
  sessionAuthToken: 'session-token',
  kmAuthToken: 'key-manager-token',
}))
const https = require('https')
const nock = require('nock')
const DatafeedEventsService = require('../../lib/DatafeedEventsService')

describe('DatafeedEventsService', () => {
  beforeAll(() => {
    jest.spyOn(https, 'request')
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('#readDatafeed', () => {
    it.skip('handles error', () => {
      const id = 'abc123'
      nock('https://keyauth.example.com')
        .get(`/agent/v4/datafeed/${id}/read`)
        .reply(200, '{"status":"success"}')
      nock('https://keyauth.example.com')
        .get(`/agent/v4/datafeed/${id}/read`)
        .reply(200, '{"status":"test"}')

      expect(DatafeedEventsService.readDatafeed(id)).resolves.toBeUndefined()

      expect(https.request).toHaveBeenCalledTimes(2)
      expect(https.request.mock.calls).toMatchSnapshot()
    })
  })
})
