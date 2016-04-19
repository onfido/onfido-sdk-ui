const queryString = require('query-string')
const {XHR_URL} = require('../utils/constants')

const xhr = {

  connect (key) {
    const query = queryString.stringify({key: key})
    const url = `${XHR_URL}?${query}`
    console.log(`connecting to ${url}`)
  },

  auth (params) {
    setTimeout(() => {
      console.log('authorised')
      params.resolve()
    }, 1000)
  },

  send (message) {
    console.log(message)
  }

}

module.exports = xhr
