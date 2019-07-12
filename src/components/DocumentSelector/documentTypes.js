// @flow
import { findKey } from '~utils/object'
import { upperCase } from '~utils/string'
export type GroupType = 'identity' | 'proof_of_address'

export type DocumentOptionsType = {
  eStatementAccepted?: boolean,
  warning?: string,
  hint?: string,
  checkAvailableInCountry?: string => boolean,
  icon: string,
  label: string,
  value: string,
}

export const idDocumentOptions = {
  passport: {
    hint: 'passport_hint',
  },
  driving_licence: {
    hint: 'driving_licence_hint',
  },
  national_identity_card: {
    hint: 'national_identity_card_hint',
  },
}

export const idDocumentTypes: string[] = Object.keys(idDocumentOptions)

const isUK = (code: string) => upperCase(code) === 'GBR'
const isNonUK = (code: string) => upperCase(code) !== 'GBR'

export const poaDocumentOptions = {
  bank_building_society_statement: {
    eStatementAccepted: true,
  },
  utility_bill: {
    hint: 'utility_bill_hint',
    warning: 'utility_bill_warning',
    eStatementAccepted: true,
  },
  council_tax: {
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  benefit_letters: {
    hint: 'benefits_letter_hint',
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  government_letter: {
    hint: 'government_letter_hint',
    icon: 'icon-letter',
    checkAvailableInCountry: isNonUK,
  },
}

export const poaDocumentTypes: string[] = Object.keys(poaDocumentOptions)

export const getDocumentTypeGroup = (documentType: string): GroupType  =>
  findKey({
    'proof_of_address': poaDocumentTypes,
    'identity': idDocumentTypes,
  }, types => types.includes(documentType))
