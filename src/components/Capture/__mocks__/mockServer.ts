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

server.get('/ssn.json').reply(
  200,
  {
    title: 'ssn title',
    template: 'ssn template',
  },
  {
    'content-type': 'application/json',
  }
)

server.get('/mno.json').reply(
  200,
  {
    title: 'mno title',
    template: 'mno template',
  },
  {
    'content-type': 'application/json',
  }
)

server.get('/consent.json').reply(500)
