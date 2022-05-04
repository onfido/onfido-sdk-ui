const core = require('@actions/core')

exports.debug = (message) => {
  console.debug(message)
}

exports.error = (message) => {
  console.error(message)
  process.exit(1)
}

exports.info = (message) => {
  console.info(message)
}

exports.exitWithError = (message) => {
  core.setFailed(message)
  process.exit(1)
}
