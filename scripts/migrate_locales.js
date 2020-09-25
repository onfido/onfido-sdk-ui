#!/usr/bin/env node
/**
 * migrate_locales v0.0.1
 *
 * A script to help integrators to migrate/rollback
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
const MIGRATE = 'migrate'
const ROLLBACK = 'rollback'

const VERSIONS = {
  'v0.0.1_v1.0.0': {
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

function printError(message) {
  console.error([COLORS.RED, `Error: ${message}`, COLORS.RESET].join(''))
}

function printHelp(errorMessage) {
  if (errorMessage) {
    printError(`${errorMessage}\n`)
  }

  console.log(`${COMMAND} - migrate/rollback between different versions of Web SDK locale system

Usage:
      ${COMMAND} migrate [options]
or    ${COMMAND} rollback [options]
or    ${COMMAND} [flags]

Examples:
      ${COMMAND} migrate -f v0.0.0 -t v1.0.0
      ${COMMAND} rollback -f v1.0.0 -t v0.0.0

Available options:
  --from-version, -f          *required* Specify which version to migrate/rollback from.
  --to-version, -t            *required* Specify which version to migrate/rollback to.
                              To see supported versions, use --list-versions flag.
  --in-file, -i               *required* Specify path to input JSON file.
                              This should be the *language* object you feed Onfido.init() method,
                              which has required *phrases* key and optional *mobilePhrases* key.
  --out-file, -o              Specify path to input JSON file.
                              If not specified, the result will be emitted to STDIN.

Available flags:
  --list-versions, -l         List supported versions for migration/rollback.
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
  const { subCommand, fromVersion, toVersion, inFile } = parsedOptions

  if (!subCommand) {
    printHelp('Unsupported sub-command')
  }

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

  const matchedVersions =
    subCommand === ROLLBACK
      ? [toVersion, fromVersion]
      : [fromVersion, toVersion]

  if (!VERSIONS[matchedVersions.join('_')]) {
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
      case MIGRATE:
      case ROLLBACK:
        parsedOptions.subCommand = args0
        break

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

function listVersions() {
  const versions = Object.keys(VERSIONS)
    .sort()
    .map((pair) => {
      const [from, to] = pair.split('_')
      return `* from ${from} to ${to}`
    })

  console.log(`\nSupported versions:${['', ...versions].join('\n  ')}`)
  process.exit(0)
}

function migrate(options) {
  const { inFile } = options
  const inputJson = JSON.parse(fs.readFileSync(inFile))
  console.log('migrate', options, inputJson)
}

function rollback(/* options */) {
  console.log('Under development...')
}

function main() {
  const { subCommand, ...options } = parseArgs()

  switch (subCommand) {
    case MIGRATE:
      migrate(options)
      break
    case ROLLBACK:
      rollback(options)
      break
  }
}

main()
