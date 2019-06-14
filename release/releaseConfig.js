const secret = require('./releaseSecret')

const Config = module.exports = {
  data: {
    ...secret,
    safeToClearWorkspace: false,
    versionRC: null,
    isFirstReleaseIteration: false
  },
  write(key, value) {
    Config.data[key] = value;
  }
}
