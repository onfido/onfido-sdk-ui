// @flow
import { findKey } from '~utils/object'
import { upperCase } from '~utils/string'
export type GroupType = 'identity' | 'proof_of_address'

export type DocumentOptionsType = {
  icon: string,
  label: string,
  detail?: string,
  warning?: string,
  eStatements?: boolean,
  checkAvailableInCountry?: (string) => boolean,
}

export const idDocumentOptions = {
  passport: {
    labelKey: 'doc_select.button_passport',
    detailKey: 'doc_select.button_passport_detail',
  },
  driving_licence: {
    labelKey: 'doc_select.button_license',
    detailKey: 'doc_select.button_license_detail',
  },
  national_identity_card: {
    labelKey: 'doc_select.button_id',
    detailKey: 'doc_select.button_id_detail',
  },
  residence_permit: {
    labelKey: 'doc_select.button_permit',
    detailKey: 'doc_select.button_permit_detail',
  },
}

export const idDocumentTypes: string[] = Object.keys(idDocumentOptions)

const isUK = (code: string) => upperCase(code) === 'GBR'
const isNonUK = (code: string) => upperCase(code) !== 'GBR'

export const poaDocumentOptions = {
  bank_building_society_statement: {
    labelKey: 'doc_select.button_bank_statement',
    eStatementsKey: 'doc_select.extra_estatements_ok',
  },
  utility_bill: {
    labelKey: 'doc_select.button_bill',
    detailKey: 'doc_select.button_bill_detail',
    warningKey: 'doc_select.extra_no_mobile',
    eStatementsKey: 'doc_select.extra_estatements_ok',
  },
  council_tax: {
    labelKey: 'doc_select.button_tax_letter',
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  benefit_letters: {
    labelKey: 'doc_select.button_benefits_letter',
    detailKey: 'doc_select.button_benefits_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  government_letter: {
    labelKey: 'doc_select.button_government_letter',
    detailKey: 'doc_select.button_government_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: isNonUK,
  },
}

export const poaDocumentTypes: string[] = Object.keys(poaDocumentOptions)

export const getDocumentTypeGroup = (documentType: string): GroupType =>
  findKey(
    {
      proof_of_address: poaDocumentTypes,
      identity: idDocumentTypes,
    },
    (types) => types.includes(documentType)
  )
