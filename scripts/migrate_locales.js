#!/usr/bin/env node
/**
 * A script to help integrators to migrate/rollback
 * between different versions of Web SDK locale system
 *
 * For more info, run:
 *
 * $ migrate_locales --help
 *
 */

'use strict' // eslint-disable-line strict

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
}
const COMMAND = 'migrate_locales'

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

function buildColorMessage(message, color) {
  return [color, message, COLORS.RESET].join('')
}

function parseOptionValue(name, trigger, params) {
  const arg = params.shift()

  if (!arg) {
    printHelpMessage(`Missing value for ${trigger} option`)
  }

  return { [name]: arg }
}

function parseArgs() {
  const params = process.argv.slice(2)
  const parsedOptions = {}

  while (params.length) {
    const args0 = params.shift()

    switch (args0) {
      case 'migrate':
      case 'rollback':
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

      case '--out-dir':
      case '-o':
        Object.assign(parsedOptions, parseOptionValue('outDir', args0, params))
        break

      case '--test':
      case '-T':
        parsedOptions.testMode = true
        break

      case '--list-versions':
      case '-l':
        printSupportedVersions()
        break

      case '--help':
      case '-h':
        printHelpMessage()
        break
    }
  }

  if (!parsedOptions.subCommand) {
    printHelpMessage('Unsupported sub-command')
    return {}
  }

  return parsedOptions
}

function printHelpMessage(errorMessage) {
  if (errorMessage) {
    console.error(buildColorMessage(`Error: ${errorMessage}`, COLORS.RED), '\n')
  }

  console.log(`${COMMAND} - migrate/rollback between different versions of Web SDK locale system

Usage:
      ${COMMAND} migrate params... [options] [flags]
or    ${COMMAND} rollback params... [options] [flags]

Examples:
      ${COMMAND} migrate -f v0.0.0 -t v1.0.0
      ${COMMAND} rollback -f v1.0.0 -t v0.0.0

Available params:
  --from-version, -f          Specify which version to migrate/rollback from.
  --to-version, -t            Specify which version to migrate/rollback to.
                              To see supported versions, use --list-versions flag.
  --out-dir, -o               Specify folder to place output files.

Available flags:
  --list-versions, -l         List supported versions for migration/rollback.
  --test, -T                  Run in test mode with test data.
  --help, -h                  Print this message.
  `)

  process.exit(errorMessage ? 1 : 0)
}

function printSupportedVersions() {
  const versions = Object.keys(VERSIONS)
    .sort()
    .map((pair) => {
      const [from, to] = pair.split('_')
      return `* from ${from} to ${to}`
    })

  console.log(`\nSupported versions:${['', ...versions].join('\n  ')}`)
  process.exit(0)
}

function main() {
  const { subCommand, fromVersion, toVersion, outDir, testMode } = parseArgs()

  if (!fromVersion) {
    printHelpMessage('Missing --from-version|-f param')
  }

  if (!toVersion) {
    printHelpMessage('Missing --to-version|-t param')
  }

  if (!outDir) {
    printHelpMessage('Missing --out-dir|-o param')
  }

  console.log('Under development...')
  console.log(
    JSON.stringify(
      { subCommand, fromVersion, toVersion, outDir, testMode },
      null,
      2
    )
  )
}

main()
