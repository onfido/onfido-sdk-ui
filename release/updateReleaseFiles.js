const { replaceInFile } = require('./util/file')
const { debug } = require('./util/logging')
const { RELEASE_VERSION } = process.env

const updatePackageJson = async () => {
  debug('Updating package.json')
  replaceInFile(
    'package.json',
    /"version": ".*"/,
    `"version": "${RELEASE_VERSION}"`
  )
}

const updateJSFiddle = async () => {
  debug('Updating fiddle/demo.details')
  replaceInFile(
    'demo/fiddle/demo.details',
    /- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/onfido\.min\.js\n\s{3}- https:\/\/assets\.onfido\.com\/web-sdk-releases\/.*\/style\.css/,
    `- https://assets.onfido.com/web-sdk-releases/${RELEASE_VERSION}/onfido.min.js\n${' '.repeat(
      3
    )}- https://assets.onfido.com/web-sdk-releases/${RELEASE_VERSION}/style.css`
  )
}

;(async () => {
  await updatePackageJson()
  await updateJSFiddle()
})()
