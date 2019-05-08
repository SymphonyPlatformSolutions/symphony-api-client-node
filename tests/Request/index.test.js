const nock = require('nock')
const FormData = require('form-data')
const request = require('../../lib/Request')

describe('Request helper', () => {
  afterAll(() => nock.isDone())

  it('handles JSON response', async () => {
    nock('https://example.com')
      .get('/test')
      .reply(200, '{"test":"body"}')
    const body = await request({ host: 'example.com', path: '/test' })
    expect(body).toEqual({ test: 'body' })
  })

  it('handles empty response', async () => {
    nock('https://example.com')
      .get('/test')
      .reply(200, '')
    const body = await request({ host: 'example.com', path: '/test' })
    expect(body).toEqual({})
  })

  it('sends JSON body', async () => {
    const requestBody = { some: 'body' }
    nock('https://example.com')
      .post('/test', requestBody)
      .reply(200, '')

    const responseBody = await request(
      { host: 'example.com', path: '/test', method: 'post' },
      '',
      requestBody
    )
    expect(responseBody).toEqual({})
  })

  it('sends form-data body', async () => {
    const form = new FormData()
    form.append('test', 'value')
    nock('https://example.com')
      .post('/test', /\r\nContent-Disposition: form-data; name="test"\r\n\r\nvalue\r\n---/)
      .reply(200, '')

    const responseBody = await request(
      { host: 'example.com', path: '/test', method: 'post' },
      '',
      form
    )
    expect(responseBody).toEqual({})
  })

  it('adds JSON content-type header', async () => {
    const requestBody = { some: 'body' }
    nock('https://example.com', { reqheaders: { 'content-type': 'application/json' } })
      .post('/test', requestBody)
      .reply(200, '')

    const responseBody = await request(
      { host: 'example.com', path: '/test', method: 'post' },
      '',
      requestBody
    )
    expect(responseBody).toEqual({})
  })

  it('does not add content-type header if present', async () => {
    const requestBody = { some: 'body' }
    nock('https://example.com', { reqheaders: { 'content-type': 'foo' } })
      .post('/test', requestBody)
      .reply(200, '')

    const responseBody = await request(
      { host: 'example.com', path: '/test', method: 'post', headers: { 'content-Type': 'foo' } },
      '',
      requestBody
    )
    expect(responseBody).toEqual({})
  })

  it('resolves with full response', async () => {
    nock('https://example.com')
      .get('/test')
      .reply(200, 'hello', { 'Content-Type': 'text/plain' })

    const response = await request({ host: 'example.com', path: '/test' }, '', null, true)
    expect(response).toEqual({
      statusCode: 200,
      headers: { 'content-type': 'text/plain' },
      body: 'hello',
    })
  })

  // TODO make this change to client behaviour in next major version
  it.skip('rejects on HTTP errors', () => {
    nock('https://example.com')
      .get('/test')
      .reply(400, '{"test":"body"}')

    return expect(request({ host: 'example.com', path: '/test' })).rejects.toEqual({
      status: 'error',
    })
  })

  it('handles request error', () => {
    nock('https://example.com')
      .get('/test')
      .replyWithError('Oh no')

    return expect(request({ host: 'example.com', path: '/test' })).rejects.toEqual({
      status: 'error',
    })
  })

  it('handles socket timeout', () => {
    nock('https://example.com')
      .get('/test')
      .socketDelay(70000)
      .reply(200, '')

    return expect(request({ host: 'example.com', path: '/test' })).rejects.toEqual({
      status: 'error',
    })
  })
})
