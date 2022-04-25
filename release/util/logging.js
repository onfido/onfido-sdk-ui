const core = require('@actions/core')

exports.debug = (message) => {
  core.debug(message)
}

exports.error = (message) => {
  core.error(message)
}

exports.info = (message) => {
  core.info(message)
}

exports.exitWithError = (message) => {
  core.setFailed(message)
  process.exit(1)
}
