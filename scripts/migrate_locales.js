#!/usr/bin/env node
/**
 * migrate_locales v0.0.1
 *
 * A script to help integrators to migrate
 * between different versions of Web SDK locale system.
 *
 * For more info, run:
 *    $ migrate_locales --help
 */

'use strict' // eslint-disable-line strict

const fs = require('fs')

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
}
const COMMAND = 'migrate_locales'

const VERSIONS = {
  'v0.0.1_v1.0.0-test': {
    'accessibility.close_sdk_screen': [
      'new_screen.accessibility.close_sdk_screen',
    ],
    'capture.council_tax.front.instructions': [
      'new_screen.capture.council_tax.front.instructions',
    ],
    'complete.message': [
      'screen_1.complete.message',
      'screen_2.complete.message',
    ],
    'confirm.close.message': [
      'screen_1.confirm.close.message',
      'screen_2.confirm.close.message',
    ],
  },
}

/* Helper functions */
function printError(message) {
  console.error([COLORS.RED, `Error: ${message}`, COLORS.RESET].join(''))
}

function printHelp(errorMessage) {
  if (errorMessage) {
    printError(`${errorMessage}\n`)
  }

  console.info(`${COMMAND} - migrate between different versions of Web SDK locale system

Usage:
      ${COMMAND} [options] [flags]

Examples:
      ${COMMAND} -f v0.0.1 -t v1.0.0 -i ./onfido-sdk-ui/language.json

Available options:
  --from-version, -f          *required* Specify which version to migrate from.
  --to-version, -t            *required* Specify which version to migrate to.
                              To see supported versions, use --list-versions flag.
  --in-file, -i               *required* Specify path to input JSON file.
                              This should be the *language* object you feed Onfido.init() method,
                              which has required *phrases* key and optional *mobilePhrases* key.
  --out-file, -o              Specify path to input JSON file.
                              If not specified, the result will be emitted to STDIN.

Available flags:
  --list-versions, -l         List supported versions for migration.
  --help, -h                  Print this message.`)

  process.exit(errorMessage ? 1 : 0)
}

function parseOptionValue(name, trigger, params) {
  const arg = params.shift()

  if (!arg) {
    printHelp(`Missing value for ${trigger} option`)
  }

  return { [name]: arg }
}

function validateOptions(parsedOptions) {
  const { fromVersion, toVersion, inFile } = parsedOptions

  if (!inFile) {
    printHelp('Missing --in-file|-i param')
  }

  if (!fs.existsSync(inFile)) {
    printError('Input file not found')
    process.exit(1)
  }

  if (!fromVersion) {
    printHelp('Missing --from-version|-f param')
  }

  if (!toVersion) {
    printHelp('Missing --to-version|-t param')
  }

  const matchedVersion = [fromVersion, toVersion].join('_')

  if (!VERSIONS[matchedVersion]) {
    printHelp(
      'Unsupported versions, use --list-versions to show supported ones.'
    )
  }
}

function parseArgs() {
  const params = process.argv.slice(2)
  const parsedOptions = {}

  while (params.length) {
    const args0 = params.shift()

    switch (args0) {
      case '--from-version':
      case '-f':
        Object.assign(
          parsedOptions,
          parseOptionValue('fromVersion', args0, params)
        )
        break

      case '--to-version':
      case '-t':
        Object.assign(
          parsedOptions,
          parseOptionValue('toVersion', args0, params)
        )
        break

      case '--in-file':
      case '-i':
        Object.assign(parsedOptions, parseOptionValue('inFile', args0, params))
        break

      case '--out-file':
      case '-o':
        Object.assign(parsedOptions, parseOptionValue('outFile', args0, params))
        break

      case '--list-versions':
      case '-l':
        listVersions()
        break

      case '--help':
      case '-h':
        printHelp()
        break
    }
  }

  validateOptions(parsedOptions)
  return parsedOptions
}

/* function deleteAtPath(object, keyPath) {
  const keys = keyPath.split('.')

  return keys.reduce((acc, cur, idx) => {
    const value = acc ? acc[cur] : undefined

    // Last key in keys path
    if (idx === keys.length - 1 && value) {
      delete acc[cur]
    }

    return value
  }, object)
} */

function deleteAtKey({ object, keyPath, level = 0 }) {
  if (!object) {
    return {}
  }

  // Key path is the key itself
  if (object[keyPath]) {
    const value = object[keyPath]
    delete object[keyPath]
    return { value, pathAsKey: true }
  }

  // Nested keys
  const nestedKeys = keyPath.split('.')
  const key = nestedKeys[level]

  // Last key in keys path
  if (level >= nestedKeys.length - 1) {
    const value = object[key]

    if (value) {
      delete object[key]
    }

    return { value, pathAsKey: false }
  }

  const { value, pathAsKey } = deleteAtKey({
    object: object[key],
    keyPath,
    level: level + 1,
  })

  if (object[key] && !Object.keys(object[key]).length) {
    delete object[key]
  }

  return { value, pathAsKey }
}

function insertAtKey({ object, value, keyPath, level = 0, pathAsKey = false }) {
  if (!object) {
    return
  }

  // Key path is the key itself
  if (pathAsKey) {
    object[keyPath] = value
    return
  }

  // Nested keys
  const nestedKeys = keyPath.split('.')
  const key = nestedKeys[level]

  // Last key in keys path
  if (level >= nestedKeys.length - 1) {
    object[key] = value
    return
  }

  if (!object[key]) {
    object[key] = {}
  }

  insertAtKey({ object: object[key], value, keyPath, level: level + 1 })
}

/* Main functions */
function listVersions() {
  const versions = Object.keys(VERSIONS)
    .sort()
    .map((pair) => {
      const [from, to] = pair.split('_')
      return `* from ${from} to ${to}`
    })

  console.info(`\nSupported versions:${['', ...versions].join('\n  ')}`)
  process.exit(0)
}

function migrate(object, options) {
  const { fromVersion, toVersion } = options
  const changeLog = VERSIONS[[fromVersion, toVersion].join('_')]

  Object.keys(changeLog).forEach((fromKey) => {
    const { value: possibleValue, pathAsKey } = deleteAtKey({
      object,
      keyPath: fromKey,
    })

    if (!possibleValue) {
      return
    }

    const toKeys = changeLog[fromKey]

    toKeys.forEach((toKey) =>
      insertAtKey({
        object,
        value: possibleValue,
        keyPath: toKey,
        pathAsKey,
      })
    )
  })
}

function main() {
  const { inFile, outFile, ...options } = parseArgs()
  const inputJson = JSON.parse(fs.readFileSync(inFile))

  const objectsToMigrate = [inputJson.phrases, inputJson.mobilePhrases]
  objectsToMigrate.forEach((object) => migrate(object, options))
  const result = JSON.stringify(inputJson, null, 2)

  if (!outFile) {
    console.info(result)
    return
  }

  fs.writeFileSync(outFile, result)
}

main()
