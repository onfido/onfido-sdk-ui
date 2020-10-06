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
  'v0.0.1_v1.0.0': {
    passport: ['doc_select.button_passport'],
    driving_licence: ['doc_select.button_driving_licence'],
    national_identity_card: ['doc_select.button_national_identity_card'],
    residence_permit: ['doc_select.button_residence_permit'],
    bank_building_society_statement: ['doc_select.button_bank_statement'],
    utility_bill: ['doc_select.button_bill'],
    council_tax: ['doc_select.button_tax_letter'],
    benefit_letters: ['doc_select.button_benefits_letter'],
    'document_selector.identity.title': ['doc_select.title'],
    'document_selector.identity.hint': ['doc_select.subtitle'],
    'document_selector.identity.passport_hint': [
      'doc_select.button_passport_detail',
    ],
    'document_selector.identity.driving_licence_hint': [
      'doc_select.button_driving_licence_detail',
    ],
    'document_selector.identity.national_identity_card_hint': [
      'doc_select.button_national_identity_card_detail',
    ],
    'document_selector.identity.residence_permit_hint': [
      'doc_select.button_residence_permit_detail',
    ],
    'webcam_permissions.allow_access': ['permission.title_cam'],
    'webcam_permissions.enable_webcam_for_selfie': ['permission.subtitle_cam'],
    'webcam_permissions.click_allow': ['permission.body_cam'],
    'webcam_permissions.enable_webcam': ['permission.button_primary_cam'],
    'webcam_permissions.access_denied': ['permission_recovery.title_cam'],
    'webcam_permissions.recover_access': ['permission_recovery.subtitle_cam'],
    'webcam_permissions.recovery': ['permission_recovery.info'],
    'webcam_permissions.follow_steps': ['permission_recovery.list_header_cam'],
    'webcam_permissions.grant_access': [
      'permission_recovery.list_item_how_to_cam',
    ],
    'webcam_permissions.refresh_page': [
      'permission_recovery.list_item_action_cam',
    ],
    'webcam_permissions.refresh': ['permission_recovery.button_primary'],
    'confirm.document.title': ['doc_confirmation.title'],
    'confirm.document.alt': ['doc_confirmation.image_accessibility'],
    'confirm.enlarge_image.enlarge': ['doc_confirmation.button_zoom'],
    'confirm.enlarge_image.close': ['doc_confirmation.button_close'],
    'confirm.passport.message': ['doc_confirmation.body_passport'],
    'confirm.driving_licence.message': ['doc_confirmation.body_license'],
    'confirm.national_identity_card.message': ['doc_confirmation.body_id'],
    'confirm.residence_permit.message': ['doc_confirmation.body_permit'],
    'confirm.bank_building_society_statement.message': [
      'doc_confirmation.body_bank_statement',
    ],
    'confirm.utility_bill.message': ['doc_confirmation.body_bill'],
    'confirm.council_tax.message': ['doc_confirmation.body_tax_letter'],
    'confirm.benefit_letters.message': [
      'doc_confirmation.body_benefits_letter',
    ],
    'confirm.confirm': ['doc_confirmation.button_primary_upload'],
    'confirm.redo': [
      'doc_confirmation.button_secondary_redo',
      'doc_confirmation.button_primary_redo',
    ],
    'confirm.upload_anyway': ['doc_confirmation.button_primary_upload_anyway'],
    'errors.image_blur.message': ['doc_confirmation.alert.blur_title'],
    'errors.image_blur.instruction': ['doc_confirmation.alert.blur_detail'],
    'errors.glare_detected.message': ['doc_confirmation.alert.blur_title'],
    'errors.glare_detected.instruction': ['doc_confirmation.alert.blur_detail'],
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

    toKeys.forEach((toKey) => {
      verboseLogging('\t*', buildColorMessage(toKey, COLORS.BLUE))

      insertAtKey({
        object,
        value: possibleValue,
        keyPath: toKey,
        pathAsKey,
      })
    })
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

  if (jsonData.mobilePhrases) {
    verboseLogging(
      `\nForce nesting ${buildColorMessage(
        'mobilePhrases',
        COLORS.BLUE
      )} in ${buildColorMessage('phrases', COLORS.BLUE)}`
    )
  }

  // Force nesting & reordering `mobilePhrases` in `phrases`
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
