module.exports = {
  "verbose": true,
  "moduleNameMapper": {
    "\\.(svg|woff2?|ttf|eot|jpe?g|png|gif)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "identity-obj-proxy",
    "^react$": "<rootDir>/node_modules/preact-compat",
    "^react-dom$": "<rootDir>/node_modules/preact-compat",
    "^react-modal$": "<rootDir>/node_modules/react-modal-onfido",
    "^~utils(.*)$": "<rootDir>/src/components/utils",

  },
  "setupFilesAfterEnv": [
    "<rootDir>/src/components/utils/unit_tests/enzymeSetup.js"
  ]
}