#!/usr/bin/env node

// eslint-disable-next-line strict
'use strict'

/**
 * A script to help integrators to migrate/rollback
 * between different versions of Web SDK locale system
 *
 * For more info, run:
 *
 * $ migrate_locales --help
 *
 */

const COMMAND = 'migrate_locales'

function parseArgs() {
  const params = process.argv.slice(2)
  const help = params.includes('--help') || params.includes('-h') || false

  return { help }
}

function printHelpMessage() {
  console.log(`${COMMAND} - migrate/rollback between different versions of Web SDK locale system

Usage:
      ${COMMAND} migrate [flags]
or    ${COMMAND} rollback [flags]

Examples:
      ${COMMAND}

Available flags:
  --help, -h              Print this message.
  `)
}

function main() {
  const { help } = parseArgs()

  if (help) {
    printHelpMessage()
    return
  }

  console.log('Under development...')
}

main()
