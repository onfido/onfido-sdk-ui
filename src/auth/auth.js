const xhr = require('../connect/xhr')

const auth = (key) => {
  return new Promise((resolve, reject) => {
    console.log(`authorising with key: ${key}`)
    params = {key, resolve, reject}
    xhr.auth(params)
  })
}

module.exports = auth
