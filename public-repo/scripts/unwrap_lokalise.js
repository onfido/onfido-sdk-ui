#!/usr/bin/env node
/**
 * A script to parse through pulled JSON files from Lokalise
 * and unwrap the content in `onfido` root key.
 * If the root key isn't `onfido` then it'll do nothing.
 *
 * For more info, run:
 *
 * $ unwrap_lokalise --help
 *
 */

'use strict' // eslint-disable-line strict

const fs = require('fs')
const path = require('path')

const BASE_DIR = '../src/locales'
const COLORS = {
  RESET: '\x1b[0m',
  BLUE: '\x1b[34m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
}
const COMMAND = 'unwrap_lokalise'
const COMMAND_VERSION = 'v1.0.0'
const TAB_WIDTH = 4

const PARSED_ARGS = {
  wrapKey: 'onfido',
}

/* Helper functions */
function buildColorMessage(message, ...colors) {
  return [...colors, message, COLORS.RESET].join('')
}

function buildEscapedJson(json) {
  const stringified = JSON.stringify(json, null, TAB_WIDTH)
  const escaped = stringified.replace(/\//gi, '\\/')
  return `${escaped}\n`
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

function parseOptionValue(name, trigger, params) {
  const arg = params.shift()

  if (!arg) {
    printHelp(`Missing value for ${trigger} option`)
  }

  return { [name]: arg }
}

function parseArgs() {
  const params = process.argv.slice(2)

  while (params.length) {
    const args0 = params.shift()

    switch (args0) {
      case '--wrap-key':
      case '-k':
        Object.assign(PARSED_ARGS, parseOptionValue('wrapKey', args0, params))
        break

      case '--test-wrap':
      case '-T':
        Object.assign(PARSED_ARGS, { testWrap: true })
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
}

function printVersion() {
  console.info(
    `unwrap_lokalise ${COMMAND_VERSION} (c) Onfido Ltd., ${new Date().getFullYear()}`
  )
  process.exit(0)
}

function printHelp(errorMessage) {
  if (errorMessage) {
    printError(`${errorMessage}\n`)
  }

  console.info(`${COMMAND} - unwrap JSON files pulled from Lokalise

Usage:
      ${COMMAND} [flags]

Examples:
      ${COMMAND}
      ${COMMAND} --wrap-key onfido_web
      ${COMMAND} --test-wrap

Available flags:
  -k, --wrap-key          Specify key to unwrap, default to 'onfido'.
  -t, --test-wrap         To wrap files with --wrap-key|-k value.
                          Do nothing if they are already wrapped.
  -v, --verbose           Verbose logging.
  -h, --help              Print this message.
  `)

  process.exit(errorMessage ? 1 : 0)
}

/* Main functions */
function unwrapFile(filePath) {
  verboseLogging(`Unwrapping file ${buildColorMessage(filePath, COLORS.GREEN)}`)
  const { wrapKey } = PARSED_ARGS
  const fileData = fs.readFileSync(filePath)
  const json = JSON.parse(fileData)
  const unwrappedJson = json[wrapKey] ? json[wrapKey] : json
  fs.writeFileSync(filePath, buildEscapedJson(unwrappedJson))
}

function wrapFile(filePath) {
  verboseLogging(`Wrapping file ${buildColorMessage(filePath, COLORS.GREEN)}`)
  const { wrapKey } = PARSED_ARGS
  const fileData = fs.readFileSync(filePath)
  const json = JSON.parse(fileData)

  const wrappedJson = json[wrapKey] ? json : { [wrapKey]: json }
  fs.writeFileSync(filePath, buildEscapedJson(wrappedJson))
}

function readDirRecursive(dirPath, extName) {
  const foundPaths = fs.readdirSync(dirPath).flatMap((file) => {
    const childPath = path.resolve(dirPath, file)

    if (fs.statSync(childPath).isDirectory()) {
      return readDirRecursive(childPath, extName)
    } else if (path.extname(childPath) === extName) {
      return childPath
    }
  })

  return foundPaths.filter((file) => file)
}

function main() {
  parseArgs()

  const { testWrap, wrapKey } = PARSED_ARGS

  const filePaths = readDirRecursive(path.resolve(__dirname, BASE_DIR), '.json')
  filePaths.forEach(testWrap ? wrapFile : unwrapFile)

  console.info(
    `All files are ${buildColorMessage(
      testWrap ? 'wrapped' : 'unwrapped',
      COLORS.YELLOW
    )} with key ${buildColorMessage(wrapKey, COLORS.BLUE)}`
  )
}

main()
