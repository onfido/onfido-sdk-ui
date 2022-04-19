const { abstractFromFile } = require('./file')
const { exitWithError } = require('./logging')

exports.getChangeLogEntry = async (version) =>
  await abstractFromFile(
    'CHANGELOG.md',
    new RegExp(`## \\[${version}\\](.|\r|\n)*?(?=\\#\\# \\[)`, 'g')
  )

exports.getDataFromBase32File = async () => {
    const content = await abstractFromFile(
      'release/BASE_32_VERSION_MAPPING.md',
      /\|\s([A-Z]{2})\s+\|\s?(.+?)\|(\s.*?)\|/g
    )
  
    if (!content) {
      exitWithError('Could not read the BASE_32_VERSION_MAPPING.md file')
    }
  
    return content.map((row) => {
      const result = row.match(/\|\s([A-Z]{2})\s+\|\s?(.+?)\|(\s.*?)\|/)
  
      if (!result) {
        return
      }
  
      return {
        hash: result[1].trim(),
        releaseVersion: result[2].trim(),
        date: result[3].trim(),
      }
    })
  }
  
  // TODO: Check! I don't think we're using true base32 hashes.
  // This is a custom method to generate next 2 char hashes
  exports.bumpBase32 = (string) => {
    let f = string[0].charCodeAt()
    let s = string[1].charCodeAt() + 1
  
    // 87 = Z
    if (s > 87) {
      s = 65 // = A
      f += 1
    }
  
    if (f > 87) {
      exitWithError('We have run out of BASE32 hashes!')
    }
  
    return `${String.fromCharCode(f)}${String.fromCharCode(s)}`
  }
  