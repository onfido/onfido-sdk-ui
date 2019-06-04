const fs = require('fs')
const processes = require('./processes')
const appRoot = require('app-root-path')

const { exitRelease } = processes

const replaceInFile = (file, regex, replaceFunc) => {
  console.log('appRoot', appRoot)
  // console.log('mainmodule', process.mainModule)
  // console.log()
  // console.log('resolve',path.resolve(path.dirname(process.mainModule.filename)))
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Something went wrong trying to load the file!')
      console.error(err)
      exitRelease()
    }

    const result = data.replace(regex, replaceFunc)

    fs.writeFile(file, result, 'utf8',  (err) => {
       if (err) {
         console.error('❌ Something went wrong trying to write to the file!')
         console.error(err)
         exitRelease()
       }
    })
  })
}

const readInFile = async (file, regex, callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Something went wrong trying to load the file!')
      console.error(err)
      exitRelease()
    }
    const result = data.match(regex)
    callback(result)
  })
}

module.exports = {
  replaceInFile,
  readInFile
}
