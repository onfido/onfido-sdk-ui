const core = require('@actions/core')

exports.debug = (message) => {
  // core.debug(message)
  console.debug(message)
}

exports.error = (message) => {
  // core.error(message)
  console.error(message)
  process.exit(1)
}

exports.info = (message) => {
  // core.info(message)
  console.info(message)
}

exports.exitWithError = (message) => {
  core.setFailed(message)
  process.exit(1)
}
