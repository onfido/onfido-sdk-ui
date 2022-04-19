const { getDataFromBase32File, bumpBase32 } = require('./util/helpers') 
const { info, exitWithError } = require('./util/logging')
const { BASE_32_VERSION, RELEASE_VERSION } = process.env

const validateBase32Hash = async () => {
  const data = await getDataFromBase32File()

  const hashExists = data.find((i) => i.hash === BASE_32_VERSION)
  const versionExists = data.find((i) => i.releaseVersion === RELEASE_VERSION)

  if (hashExists) {
    exitWithError(
      `The base32 hash already exists in BASE_32_VERSION_MAPPING.md`
    )
  }

  if (versionExists) {
    exitWithError(
      'The release version already exists in BASE_32_VERSION_MAPPING.md'
    )
  }

  // Upgrade last base32 hash and compare to input
  const newBase32 = bumpBase32(data.slice(-1)[0].hash)

  if (newBase32 !== BASE_32_VERSION) {
    exitWithError(
      `The provided base32 version is not the next one (provided=${BASE_32_VERSION}, expected=${newBase32})`
    )
  }
}

const validateAgainstAWS = async () => {
  info(`Base32 validation against AWS is not implemented yet`)
}

;(async () => {
  await validateBase32Hash()
  await validateAgainstAWS()
})()
