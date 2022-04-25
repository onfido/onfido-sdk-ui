const { exitWithError, info } = require('./logging')

exports.cleanVersion = (version) => version.replace(/-.*/, '')

exports.isFullVersion = (version) => !version.match(/-.*\..*/g)

// TODO: Check! I don't think we're using true base32 hashes.
// This is a custom method to generate next 2 char hashes
exports.bumpBase32 = (string) => {
  let f = string[0].charCodeAt()
  let s = string[1].charCodeAt() + 1

  // 87 = W
  if (s > 90) {
    s = 65 // = A
    f += 1
  }

  if (f > 89) {
    info('We are running out of BASE32 hashes!')
  }

  if (f > 90) {
    exitWithError('We have run out of BASE32 hashes!')
  }

  return `${String.fromCharCode(f)}${String.fromCharCode(s)}`
}
