#!/usr/bin/env node

// eslint-disable-next-line strict
'use strict'

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
const fs = require('fs')
const path = require('path')

const BASE_DIR = '../src/locales'
const COMMAND = 'unwrap_lokalise'
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

function parseArgs() {
  const params = process.argv.slice(2)
  const help = params.includes('--help') || params.includes('-h') || false
  const testWrap =
    params.includes('--test-wrap') || params.includes('-t') || false

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

  const filePaths = readDirRecursive(path.resolve(__dirname, BASE_DIR), '.json')
  filePaths.forEach(testWrap ? wrapFile : unwrapFile)
  console.log('Unwrapping files done')
}

main()
