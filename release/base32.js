/*
  Manages base32 hashes with AWS s3 bucket as origin point

  Process:
  - Get base32map.json from AWS
  - Compare input against map, re-use base32 or generate new one
    - When we re-use the token, we validate the version against the onfido.min.js file in that directory on AWS
    - When we generate a new token, we create an empty (placeholder) directory on AWS
  - We update the base32map.json and upload to AWS
  - We update all local files
  - Done.
*/
const moment = require('moment')
const { execute } = require('./util/terminal')
const { readFile, writeToFile, replaceInFile } = require('./util/file')
const { exitWithError, debug } = require('./util/logging')
const { cleanVersion, bumpBase32 } = require('./util/helpers')

const { AWS_S3_BUCKET, RELEASE_VERSION } = process.env
const AWS_BASE = `s3://${AWS_S3_BUCKET}/web-sdk-base32-releases/`

const base32 = async () => {
  await execute('mkdir -p aws')
  await execute(`aws s3 cp ${AWS_BASE}base32map.json aws`)

  let AWSBase32Map = JSON.parse(await readFile('aws/base32map.json'))

  let versionData = findVersionInMap(AWSBase32Map)

  if (versionData) {
    ;[AWSBase32Map, versionData] = updateBase32Map(AWSBase32Map, versionData)
  } else {
    ;[AWSBase32Map, versionData] = addNewBase32ToMap(AWSBase32Map)
  }

  debug(`Updating files with: ${JSON.stringify(versionData)}`)
  await validateAgainstAWS(versionData)
  await updateAndUploadFiles(AWSBase32Map, versionData)

  debug('Deleting local aws cache')
  await execute('rm -rf aws')
}

/*
  Rules:
    - `-rc.*` can be overwritten by another rc, test or full release
    - `-test.*` can be overwritten by another rc, test, or full release
    - `-alpha.*` can't be overwritten
    - `-beta.*` can't be overwritten
    - full version can't be overwritten
*/
const findVersionInMap = (AWSBase32Map) => {
  return AWSBase32Map.find((i) => {
    const v = i.releaseVersion
    const allowOverwrite = !!i.releaseVersion.match(/-(rc|test).*/)

    if (allowOverwrite && cleanVersion(v) === cleanVersion(RELEASE_VERSION)) {
      return true
    }

    if (v === RELEASE_VERSION) {
      return true
    }

    return false
  })
}

const updateBase32Map = (AWSBase32Map, versionData) => {
  const allowOverwrite = !!versionData.releaseVersion.match(/-(rc|test).*/)

  const entry = !allowOverwrite
    ? versionData
    : {
        ...versionData,
        releaseVersion: RELEASE_VERSION,
      }

  debug('Updating base32 map')
  AWSBase32Map = AWSBase32Map.map((i) =>
    i.hash === versionData.hash ? entry : i
  )
  return [AWSBase32Map, entry]
}

const addNewBase32ToMap = (AWSBase32Map) => {
  const latestBase32 = AWSBase32Map.slice(-1)[0]?.hash
  const base32 = bumpBase32(latestBase32)

  const entry = {
    hash: base32,
    releaseVersion: RELEASE_VERSION,
    date: moment().format('YYYY-MM-DD'),
    comment: '',
  }

  debug(`Generated new base32 ${base32} (previous=${latestBase32})`)
  debug('Add new entry to base32 map')
  return [[...AWSBase32Map, entry], entry]
}

// Make sure we don't override other version by accident
const validateAgainstAWS = async (versionData) => {
  const base32 = versionData.hash
  const { stdout } = await execute(
    `aws --output json s3api list-objects --bucket ${AWS_S3_BUCKET} --prefix 'web-sdk-base32-releases/${base32}/'`
  )
  const dirExists = stdout.length > 1
  if (!dirExists) {
    return true
  }

  let fileStructure
  try {
    fileStructure = JSON.parse(stdout)?.Contents
  } catch {
    exitWithError('Could not parse response from AWS')
  }

  // No files exist in dir
  if (fileStructure.length) {
    return true
  }

  await execute(`mkdir -p aws/${base32}`)
  await execute(
    `aws s3 cp ${AWS_BASE}${base32}/onfido.min.js aws/${base32}/onfido.min.js`
  )

  const sourceFile = await readFile(`aws/${base32}/onfido.min.js`)
  const awsSourceFileVersion = await getVersionFromSourceFile(sourceFile)

  if (
    !(
      awsSourceFileVersion === RELEASE_VERSION &&
      awsSourceFileVersion === cleanVersion(RELEASE_VERSION)
    )
  ) {
    exitWithError(
      'The base32 we want to use is already used by another version'
    )
  }

  debug('Validation against AWS is looking good')
  return true
}

const getVersionFromSourceFile = (sourceFile) => {
  const [_all, commentVersion] = sourceFile.match(
    /\/\*\! OnfidoIDV SDK (.*?) \*\//
  )
  if (commentVersion) {
    return commentVersion
  }

  const [_all2, sdkVersionResults] = sourceFile.match(/sdk_version:"(.*?)"/)
  return sdkVersionResults
}

const updateAndUploadFiles = async (AWSBase32Map, versionData) => {
  debug('Uploading updated base32map.json to AWS')
  await writeToFile('aws/base32map.json', JSON.stringify(AWSBase32Map, null, 2))
  await execute(
    `aws s3 cp aws/base32map.json ${AWS_BASE}base32map.json --acl public-read`
  )

  debug('Updating workflows.config')
  await replaceInFile(
    'release/githubActions/workflows.config',
    /^BASE_32_VERSION\s*=.*$/gm,
    `BASE_32_VERSION=${versionData.hash}`
  )

  await replaceInFile(
    'release/githubActions/workflows.config',
    /^RELEASE_VERSION\s*=.*$/gm,
    `RELEASE_VERSION=${RELEASE_VERSION}`
  )

  debug('Updating build/webpack/constants.ts')
  await replaceInFile(
    'build/webpack/constants.ts',
    /export const BASE_32_VERSION = '[A-Z]+'/,
    `export const BASE_32_VERSION = '${versionData.hash}'`
  )

  debug('Generating new BASE_32_VERSION_MAPPING.md')
  await writeToFile(
    'release/BASE_32_VERSION_MAPPING.md',
    [
      '### Base32 version mapping to SDK version',
      '> This file generated automatically',
      '',
      '| BASE_32_VERSION | SDK_VERSION      | DATE       | NOTES                                                                                                                                                                                                                |',
      '| --------------- | ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |',
      ...AWSBase32Map.map(
        (i) =>
          `| ${i.hash}              | ${i.releaseVersion}           | ${i.date} |  ${i.comment}                                                                                                                                                                                                                |`
      ),
    ].join('\n')
  )
}

;(async () => {
  await base32()
})()
