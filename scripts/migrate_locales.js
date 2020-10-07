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
    cancel: ['switch_phone.info_link_refresh'],
    continue: ['selfie_intro.button_primary'],
    /* DocumentSelector screens */
    passport: ['doc_select.button_passport'],
    driving_licence: ['doc_select.button_driving_licence'],
    national_identity_card: ['doc_select.button_national_identity_card'],
    residence_permit: ['doc_select.button_residence_permit'],
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
    bank_building_society_statement: ['doc_select.button_bank_statement'],
    utility_bill: ['doc_select.button_bill'],
    council_tax: ['doc_select.button_tax_letter'],
    benefit_letters: ['doc_select.button_benefits_letter'],
    'document_selector.proof_of_address.title': ['doc_select.title_poa'],
    'document_selector.proof_of_address.hint': ['doc_select.subtitle_poa'],
    'document_selector.proof_of_address.estatements_accepted': [
      'doc_select.extra_estatements_ok',
    ],
    'document_selector.proof_of_address.utility_bill_hint': [
      'doc_select.button_bill_detail',
    ],
    'document_selector.proof_of_address.utility_bill_warning': [
      'doc_select.extra_no_mobile',
    ],
    'document_selector.proof_of_address.benefits_letter_hint': [
      'doc_select.button_benefits_letter_detail',
    ],
    /* CountrySelector screens */
    'country_selection.title': ['country_select.title'],
    'country_selection.search': ['country_select.search.label'],
    'country_selection.placeholder': [
      'country_select.search.input_placeholder',
    ],
    'country_selection.dropdown_error': [
      'country_select.alert_dropdown.country_not_found',
    ],
    'country_selection.error': ['country_select.alert.another_doc'],
    'country_selection.submit': ['country_select.button_primary'],
    /* ImageQualityGuide screens */
    'image_quality_guide.title': ['upload_guide.title'],
    'image_quality_guide.sub_title': ['upload_guide.subtitle'],
    'image_quality_guide.cutoff.label': [
      'upload_guide.image_detail_cutoff_label',
    ],
    'image_quality_guide.cutoff.image_alt_text': [
      'upload_guide.image_detail_cutoff_alt',
    ],
    'image_quality_guide.no_blue.label': [
      'upload_guide.image_detail_blur_label',
    ],
    'image_quality_guide.no_blue.image_alt_text': [
      'upload_guide.image_detail_blur_alt',
    ],
    'image_quality_guide.no_glare.label': [
      'upload_guide.image_detail_glare_label',
    ],
    'image_quality_guide.no_glare.image_alt_text': [
      'upload_guide.image_detail_glare_alt',
    ],
    'image_quality_guide.all_good.label': [
      'upload_guide.image_detail_good_label',
    ],
    'image_quality_guide.all_good.image_alt_text': [
      'upload_guide.image_detail_good_alt',
    ],
    'image_quality_guide.next_step': ['upload_guide.button_primary'],
    /* Document submit screens */
    'capture.passport.front.title': ['doc_submit.title_passport'],
    'capture.driving_licence.front.title': ['doc_submit.title_licence_front'],
    'capture.driving_licence.back.title': ['doc_submit.title_licence_back'],
    'capture.national_identity_card.front.title': ['doc_submit.title_id_front'],
    'capture.national_identity_card.back.title': ['doc_submit.title_id_back'],
    'capture.residence_permit.front.title': ['doc_submit.title_permit_front'],
    'capture.residence_permit.back.title': ['doc_submit.title_permit_back'],
    'capture.bank_building_society_statement.front.title': [
      'doc_submit.title_bank_statement',
    ],
    'capture.utility_bill.front.title': ['doc_submit.title_bill'],
    'capture.council_tax.front.title': ['doc_submit.title_tax_letter'],
    'capture.benefit_letters.front.title': ['doc_submit.title_benefits_letter'],
    'cross_device.switch_device.header': ['doc_submit.subtitle'],
    'capture.switch_device': ['doc_submit.button_primary'],
    'capture.upload_file': ['doc_submit.button_link_upload'],
    /* Cross device - Intro screen */
    'cross_device.intro.title': ['xdevice_intro.title'],
    'cross_device.intro.sub_title': ['xdevice_intro.subtitle'],
    'cross_device.intro.description_li_1': [
      'xdevice_intro.list_item_send_phone',
    ],
    'cross_device.intro.description_li_2': [
      'xdevice_intro.list_item_open_link',
    ],
    'cross_device.intro.description_li_3': ['xdevice_intro.list_item_finish'],
    'cross_device.intro.action': ['xdevice_intro.button_primary'],
    /* Cross device - CrossDeviceLink screens */
    'cross_device.link.title': ['get_link.title'],
    'cross_device.link.qr_code_sub_title': ['get_link.subtitle_qr'],
    'cross_device.link.options_divider_label': ['get_link.link_divider'],
    'cross_device.link.sms_option': ['get_link.link_sms'],
    'cross_device.link.copy_link_option': ['get_link.link_url'],
    'cross_device.link.qr_code_option': ['get_link.link_qr'],
    'cross_device.link.sms_sub_title': ['get_link.subtitle_sms'],
    'cross_device.link.sms_label': ['get_link.number_field_label'],
    'cross_device.phone_number_placeholder': [
      'get_link.number_field_input_placeholder',
    ],
    'cross_device.link.button_copy.action': ['get_link.button_submit'],
    'cross_device.link.button_copy.status': ['get_link.loader_sending'],
    'errors.invalid_number.message': ['get_link.alert_wrong_number'],
    'cross_device.link.copy_link_sub_title': ['get_link.subtitle_url'],
    'cross_device.link.copy_link_label': ['get_link.url_field_label'],
    'cross_device.link.copy_link.action': ['get_link.button_copy'],
    'cross_device.link.copy_link.success': ['get_link.button_copied'],
    /* Cross device - MobileNotificationSent screen */
    'cross_device.mobile_notification_sent.title': ['sms_sent.title'],
    'cross_device.mobile_notification_sent.submessage': ['sms_sent.subtitle'],
    'cross_device.mobile_notification_sent.bold_message': [
      'sms_sent.subtitle_minutes',
    ],
    'cross_device.tips': ['sms_sent.info', 'switch_phone.info'],
    'cross_device.mobile_notification_sent.tips.item_1': [
      'sms_sent.info_link_window',
    ],
    'cross_device.mobile_notification_sent.tips.item_2': [
      'sms_sent.info_link_expire',
    ],
    'cross_device.mobile_notification_sent.resend_link': ['sms_sent.link'],
    /* Cross device - MobileConnected screen */
    'cross_device.mobile_connected.title.message': ['switch_phone.title'],
    'cross_device.mobile_connected.title.submessage': ['switch_phone.subtitle'],
    'cross_device.mobile_connected.tips.item_1': [
      'switch_phone.info_link_window',
    ],
    'cross_device.mobile_connected.tips.item_2': [
      'switch_phone.info_link_expire',
    ],
    'cross_device.mobile_connected.tips.item_3': [
      'switch_phone.info_link_refresh',
    ],
    /* Cross device - ClientSuccess screen */
    'cross_device.client_success.title': ['xdevice_return.title'],
    'cross_device.client_success.sub_title': ['xdevice_return.subtitle'],
    'cross_device.client_success.body': ['xdevice_return.body'],
    /* Cross device - CrossDeviceSubmit screen */
    'cross_device.submit.title': ['xdevice_checklist.title'],
    'cross_device.submit.sub_title': ['xdevice_checklist.subtitle'],
    'cross_device.submit.multiple_docs_uploaded': [
      'xdevice_checklist.list_item_doc_multiple',
    ],
    'cross_device.submit.one_doc_uploaded': [
      'xdevice_checklist.list_item_doc_one',
    ],
    'cross_device.submit.selfie_uploaded': [
      'xdevice_checklist.list_item_selfie',
    ],
    'cross_device.submit.video_uploaded': ['xdevice_checklist.list_item_video'],
    'cross_device.submit.action': ['xdevice_checklist.button_primary'],
    /* Cross device - Error screens */
    'errors.forbidden_client_error.message': ['xdevice_error_desktop.title'],
    'errors.forbidden_client_error.instruction': [
      'xdevice_error_desktop.subtitle',
    ],
    'errors.generic_client_error.message': ['xdevice_error_restart.title'],
    'errors.generic_client_error.instruction': [
      'xdevice_error_restart.subtitle',
    ],
    'errors.unsupported_android_browser.message': [
      'error_unsupported_browser.title_android',
    ],
    'errors.unsupported_android_browser.instruction': [
      'error_unsupported_browser.subtitle_android',
    ],
    'errors.unsupported_ios_browser.message': [
      'error_unsupported_browser.title_ios',
    ],
    'errors.unsupported_ios_browser.instruction': [
      'error_unsupported_browser.subtitle_ios',
    ],
    /* CameraPermissions screens */
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
    /* Document confirm screens */
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
    'errors.invalid_capture.message': ['doc_confirmation.alert.no_doc_title'],
    'errors.invalid_capture.instruction': [
      'doc_confirmation.alert.no_doc_detail',
    ],
    'errors.image_blur.message': ['doc_confirmation.alert.blur_title'],
    'errors.image_blur.instruction': ['doc_confirmation.alert.blur_detail'],
    'errors.glare_detected.message': ['doc_confirmation.alert.glare_title'],
    'errors.glare_detected.instruction': [
      'doc_confirmation.alert.glare_detail',
    ],
    'errors.image_crop.message': ['doc_confirmation.alert.crop_detail'],
    'errors.image_crop.instruction': ['doc_confirmation.alert.crop_detail'],
    /* Selfie intro screen */
    'capture.face.intro.title': ['selfie_intro.title'],
    'capture.face.intro.subtitle': ['selfie_intro.subtitle'],
    'capture.face.intro.selfie_instruction': [
      'selfie_intro.list_item_face_forward',
    ],
    'capture.face.intro.glasses_instruction': [
      'selfie_intro.list_item_no_glasses',
    ],
    'capture.face.intro.accessibility.selfie_capture_tips': [
      'selfie_intro.list_accessibility',
    ],
    /* Selfie capture screen */
    'capture.face.title': ['selfie_capture.title'],
    'accessibility.camera_view': ['selfie_capture.frame_accessibility'],
    'accessibility.shutter': ['selfie_capture.button_accessibility'],
    'errors.camera_inactive.message': [
      'selfie_capture.alert.camera_inactive.title',
    ],
    'errors.camera_inactive.instruction': [
      'selfie_capture.alert.camera_inactive.detail',
    ],
    'errors.camera_inactive_no_fallback.instruction': [
      'selfie_capture.alert.camera_not_working.detail_no_fallback',
    ],
    'errors.camera_not_working.message': [
      'selfie_capture.alert.camera_not_working.title',
    ],
    'errors.camera_not_working.instruction': [
      'selfie_capture.alert.camera_not_working.detail',
    ],
    'errors.camera_not_working_no_fallback.instruction': [
      'selfie_capture.alert.camera_not_working.detail_no_fallback',
    ],
    /* Selfie confirmation screen */
    'confirm.face.standard.title': ['selfie_confirmation.title'],
    'confirm.face.standard.message': ['selfie_confirmation.subtitle'],
    'confirm.face.standard.alt': ['selfie_confirmation.image_accessibility'],
    /* Video intro screen */
    'capture.liveness.intro.title': ['video_intro.title'],
    'accessibility.selfie_video_actions': ['video_intro.list_accessibility'],
    'capture.liveness.intro.two_actions': ['video_intro.list_item_actions'],
    'capture.liveness.intro.speak_out_loud': ['video_intro.list_item_speak'],
    'capture.liveness.intro.continue': ['video_intro.button_primary'],
    /* Photo upload screen */
    'capture.passport.front.instructions': ['photo_upload.body_passport'],
    'capture.driving_licence.front.instructions': [
      'photo_upload.body_license_front',
    ],
    'capture.driving_licence.back.instructions': [
      'photo_upload.body_license_back',
    ],
    'capture.national_identity_card.front.instructions': [
      'photo_upload.body_id_front',
    ],
    'capture.national_identity_card.back.instructions': [
      'photo_upload.body_id_back',
    ],
    'capture.face.upload_title': ['photo_upload.title_selfie'],
    'capture.face.instructions': ['photo_upload.body_selfie'],
    'capture.take_photo': ['photo_upload.button_primary'],
    /* Complete screen */
    'complete.submessage': ['outro.title'],
    'complete.message': ['outro.body'],
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
  -S, --strict                Run in strict mode, i.e. all not found keys will be warned.
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

      case '--strict':
      case '-S':
        Object.assign(PARSED_ARGS, { strictMode: true })
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
    return { value, pathAsKey: keyPath.split('.').length > 1 }
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

  const { fromVersion, toVersion, strictMode } = PARSED_ARGS
  const changeLog = VERSIONS[[fromVersion, toVersion].join('_')]

  verboseLogging(
    `\nMigrating locale keys for ${buildColorMessage(dataKey, COLORS.BLUE)}\n`
  )

  Object.keys(changeLog).forEach((fromKey) => {
    const { value: possibleValue, pathAsKey } = deleteAtKey({
      object,
      keyPath: fromKey,
    })

    if (!possibleValue) {
      if (strictMode) {
        verboseLogging(
          `\n  ${buildColorMessage(
            'WARNING',
            COLORS.YELLOW
          )}: Key ${buildColorMessage(fromKey, COLORS.YELLOW)} not found!`
        )
      }
      return
    }

    const toKeys = changeLog[fromKey]

    verboseLogging(
      `  - Replace ${buildColorMessage(fromKey, COLORS.YELLOW)} with:`
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

  // Force nesting & reordering `mobilePhrases` in `phrases`
  delete phrases.mobilePhrases
  delete jsonData.mobilePhrases
  phrases.mobilePhrases = mobilePhrases

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

// jq '{ phrases: . }' ./src/locales/en_US/en_US.json > ./src/locales/en_US/en_US_wrapped.json
main()
// jq '.phrases' ./src/locales/en_US/en_US_migrated.json > ./src/locales/en_US/en_US_migrated_unwrapped.json
