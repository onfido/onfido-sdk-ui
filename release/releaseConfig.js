const secret = require('./releaseSecret')

const Config = module.exports = {
  data: {
    ...secret,
    safeToClearWorkspace: false,
    versionRC: null,
    isFirstReleaseIteration: false,
    s3Flags: '--exclude "*.html" --profile Public',
  },
  write(key, value) {
    Config.data[key] = value;
  }
}
