#!/usr/bin/env node
/**
 * A script to help integrators to migrate
 * between different versions of Web SDK locale system.
 *
 * For more info, run:
 *    $ migrate_locales --help
 */

'use strict' // eslint-disable-line strict

const fs = require('fs')

const COLORS = {
  RESET: '\x1b[0m',
  BLUE: '\x1b[34m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
}
const COMMAND = 'migrate_locales'
const VERSION = 'v1.0.0'

const VERSIONS = {
  /**
   * Demo data. We use this for test/demo purposes only.
   * @TODO Update this with final key naming changes.
   */
  'v0.0.1_v1.0.0-test': {
    'accessibility.close_sdk_screen': [
      'new_screen.accessibility.close_sdk_screen',
    ],
    'capture.driving_licence.front.instructions': [
      'new_screen.driving_licence.front.instructions',
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

const PARSED_ARGS = {}

/* Helper functions */
function buildColorMessage(message, ...colors) {
  return [...colors, message, COLORS.RESET].join('')
}

function printError(message) {
  console.error(buildColorMessage(`Error: ${message}`, COLORS.RED))
}

function verboseLogging(...args) {
  if (!PARSED_ARGS.verbose) {
    return
  }

  console.log(...args)
}

function printVersion() {
  console.info(
    `migrate_locales ${VERSION} (c) Onfido Ltd., ${new Date().getFullYear()}`
  )
  process.exit(0)
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
  -f, --from-version          *required* Specify which version to migrate from.
  -t, --to-version            *required* Specify which version to migrate to.
                              To see supported versions, use --list-versions flag.
  -i, --in-file               *required* Specify path to input JSON file.
                              This should be the *language* object you feed Onfido.init() method,
                              which has a required *phrases* key and an optional *mobilePhrases* key.
  -o, --out-file              Specify path to output JSON file.
                              If not specified, the result will be emitted to STDOUT.

Available flags:
  -l, --list-versions         List supported versions for migration.
  -v, --verbose               Verbose logging.
  -V, --version               Show the current version of the script.
  -h, --help                  Show this message.`)

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

  while (params.length) {
    const args0 = params.shift()

    switch (args0) {
      case '--from-version':
      case '-f':
        Object.assign(
          PARSED_ARGS,
          parseOptionValue('fromVersion', args0, params)
        )
        break

      case '--to-version':
      case '-t':
        Object.assign(PARSED_ARGS, parseOptionValue('toVersion', args0, params))
        break

      case '--in-file':
      case '-i':
        Object.assign(PARSED_ARGS, parseOptionValue('inFile', args0, params))
        break

      case '--out-file':
      case '-o':
        Object.assign(PARSED_ARGS, parseOptionValue('outFile', args0, params))
        break

      case '--list-versions':
      case '-l':
        listVersions()
        break

      case '--verbose':
      case '-v':
        Object.assign(PARSED_ARGS, { verbose: true })
        break

      case '--version':
      case '-V':
        printVersion()
        break

      case '--help':
      case '-h':
        printHelp()
        break
    }
  }

  validateOptions(PARSED_ARGS)
}

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

function migrate(object, dataKey) {
  if (!object || !Object.keys(object).length) {
    return
  }

  const { fromVersion, toVersion } = PARSED_ARGS
  const changeLog = VERSIONS[[fromVersion, toVersion].join('_')]

  verboseLogging(
    `\nMigrate locale keys for ${buildColorMessage(dataKey, COLORS.BLUE)}:\n`
  )

  Object.keys(changeLog).forEach((fromKey) => {
    const { value: possibleValue, pathAsKey } = deleteAtKey({
      object,
      keyPath: fromKey,
    })

    if (!possibleValue) {
      return
    }

    const toKeys = changeLog[fromKey]

    verboseLogging(
      `  - Found obsolete key ${buildColorMessage(
        fromKey,
        COLORS.YELLOW
      )}, replace with:`
    )
    toKeys.forEach((toKey) =>
      verboseLogging('\t*', buildColorMessage(toKey, COLORS.BLUE))
    )

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
  parseArgs()

  const { inFile, outFile } = PARSED_ARGS
  const jsonData = JSON.parse(fs.readFileSync(inFile))

  const { phrases } = jsonData

  // `mobilePhrases` could be at root or nested in `phrases`
  const mobilePhrases = phrases.mobilePhrases || jsonData.mobilePhrases

  migrate(phrases, 'phrases')
  migrate(mobilePhrases, 'mobilePhrases')

  // Force nesting `mobilePhrases` in `phrases`
  delete phrases.mobilePhrases
  delete jsonData.mobilePhrases
  phrases.mobilePhrases = mobilePhrases

  const result = JSON.stringify(jsonData, null, 2)

  if (!outFile) {
    verboseLogging('\nMigrated data:')
    console.info(result)
  } else {
    fs.writeFileSync(outFile, result)
    console.info(
      `\nMigrated data written to ${buildColorMessage(outFile, COLORS.GREEN)}`
    )
  }
}

main()
