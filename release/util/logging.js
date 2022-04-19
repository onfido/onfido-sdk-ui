// const core = require('@actions/core')

exports.log = (message) => {
  console.log(message)
  // core.debug(message)
}

exports.error = (message) => {
  console.log(message)
  // core.error(message)
}

exports.info = (message) => {
  console.log(message)
  // core.info(message)
}

exports.exitWithError = (message) => {
  console.log(message)
  // core.setFailed(message)
  // process.exit(1)
}
