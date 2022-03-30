const fs = require('fs')
const basePath = process.cwd()

const replaceInFile = (file, regex, replaceFunc) =>
  new Promise((resolve, reject) => {
    fs.readFile(`${basePath}/${file}`, 'utf8', (readErr, data) => {
      if (readErr) {
        const error = new Error(
          '❌ Something went wrong trying to load the file!'
        )
        Object.assign(error, { meta: readErr })
        reject(error)
        return
      }

      const result = data.replace(regex, replaceFunc)

      fs.writeFile(`${basePath}/${file}`, result, 'utf8', (writeErr) => {
        if (writeErr) {
          const error = new Error(
            '❌ Something went wrong trying to write to the file!'
          )
          Object.assign(error, { meta: writeErr })
          reject(error)
          return
        }

        resolve()
      })
    })
  })

const getFromFile = (file, regex) => 
  new Promise((resolve, reject) => {
    fs.readFile(`${basePath}/${file}`, 'utf8', (readErr, data) => {
      if (readErr) {
        const error = new Error(
          '❌ Something went wrong trying to load the file!'
        )
        Object.assign(error, { meta: readErr })
        reject(error)
        return
      }

      const result = data.match(regex)
      resolve(result)
    })
  })


module.exports = {
  replaceInFile,
  getFromFile,
  basePath,
}
