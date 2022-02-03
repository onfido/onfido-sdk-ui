const { defaults } = require('jest-config')
module.exports = {
  ...defaults,
  transformIgnorePatterns: ['node_modules/(?!@onfido/castor)'],
  // ...
}
