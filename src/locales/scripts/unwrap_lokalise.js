#!/usr/bin/env node

/**
 * Script to parse through pulled JSON files from Lokalise
 * and unwrap the content in `onfido` root key.
 * If the root key isn't `onfido` then it'll do nothing.
 *
 * For more info, run:
 *      node unwrap_lokalise.js --help
 *
 * or grant execute permission and run as standalone command:
 *      chmod u+x unwrap_lokalise.js
 *      ./unwrap_lokalise.json --help
 */
const fs = require('fs')
const glob = require('glob')

const COMMAND = 'unwrap_lokalise'
const FILES_GLOB = './src/locales/**/*.json'
const TAB_WIDTH = 4
const WRAP_KEY = 'onfido'

function buildEscapedJson(json) {
  const stringified = JSON.stringify(json, null, TAB_WIDTH)
  const escaped = stringified.replace(/\//gi, '\\/')
  return `${escaped}\n`
}

function unwrapFile(filePath) {
  const fileData = fs.readFileSync(filePath)
  const json = JSON.parse(fileData)
  const unwrappedJson = json[WRAP_KEY] ? json[WRAP_KEY] : json
  fs.writeFileSync(filePath, buildEscapedJson(unwrappedJson))
}

// For test purposes
function wrapFile(filePath) {
  const fileData = fs.readFileSync(filePath)
  const json = JSON.parse(fileData)

  const wrappedJson = json[WRAP_KEY] ? json : { [WRAP_KEY]: json }
  fs.writeFileSync(filePath, buildEscapedJson(wrappedJson))
}

function parseArgs() {
  const params = process.argv.slice(2)
  const help = params.includes('--help') || params.includes('-h') || false
  const testWrap = params.includes('--test-wrap') || params.includes('-t') || false

  return { help, testWrap }
}

function printHelpMessage() {
  console.log(`${COMMAND} - unwrap JSON files pulled from Lokalise

Usage:
      ${COMMAND} [flags]

Examples:
      ${COMMAND}
      ${COMMAND} --test-wrap

Available flags:
  --test-wrap, -t         To wrap JSON files with "${WRAP_KEY}" key.
                          Do nothing if they are already wrapped.
  --help, -h              Print this message.
  `)
}

function main() {
  const { help, testWrap } = parseArgs()

  if (help) {
    printHelpMessage()
    return
  }

  const filePaths = glob.sync(FILES_GLOB)
  filePaths.forEach(testWrap ? wrapFile : unwrapFile)
}

main();
