import * as nock from 'nock'

const server = nock('http://localhost:3000')
  .defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': '*',
  })
  .persist()

// Don't allow real localhost call to leak through
nock.disableNetConnect()

server.intercept('/json', 'OPTIONS').reply(200)
server.get('/json').reply(
  200,
  { ping: 'pong' },
  {
    'content-type': 'application/json',
  }
)

server.intercept('/raw', 'OPTIONS').reply(200)
server.get('/raw').reply(200, '{"ping":"pong"}')

server.intercept('/204', 'OPTIONS').reply(200)
server.get('/204').reply(204)

server.intercept('/404', 'OPTIONS').reply(200)
server.get('/404').reply(404)

server.intercept('/error', 'OPTIONS').reply(200)
server.get('/error').replyWithError('mock server error on purpose')
