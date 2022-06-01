const { exitWithError } = require('./logging')
const fs = require('fs')
const basePath = process.cwd()

const readFile = async (file) => {
  let data
  try {
    data = await fs.readFileSync(file, 'utf-8')
  } catch {
    exitWithError(`Something went wrong trying to load the file! (${file})`)
  }

  return data
}

const writeToFile = async (file, content) => {
  try {
    fs.writeFileSync(`${basePath}/${file}`, content, 'utf-8')
  } catch {
    exitWithError(`Something went wrong trying to write to the file! (${file})`)
  }
}

const replaceInFile = async (file, regex, replaceFunc) => {
  const filePath = `${basePath}/${file}`
  try {
    const data = await readFile(filePath)

    if (!data) {
      return
    }

    const result = data.replace(regex, replaceFunc)
    await writeToFile(file, result)
  } catch (e) {
    console.log(e)
    exitWithError(
      `Something when wrong trying to replace content in the file! (${file})`
    )
  }
}

const abstractFromFile = async (file, regex) => {
  try {
    const data = await readFile(`${basePath}/${file}`)
    if (!data) {
      return
    }
    return data.match(regex)
  } catch {
    exitWithError(`Something went wrong trying to read the file! (${file})`)
  }
}

const appendToFile = async (file, content) => {
  try {
    fs.appendFileSync(`${basePath}/${file}`, content, 'utf-8')
  } catch (e) {
    exitWithError(
      `Something went wrong trying to append to the file! (${file})`
    )
  }
}

module.exports = {
  readFile,
  writeToFile,
  replaceInFile,
  abstractFromFile,
  appendToFile,
}
