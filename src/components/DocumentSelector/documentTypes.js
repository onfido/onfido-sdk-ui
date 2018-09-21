// @flow
import { findKey } from '../utils/object'
import { includes } from '../utils/array'
import { upperCase } from '../utils/string'
export type GroupType = 'identity' | 'proof_of_address'

export type DocumentOptionsType = {
  eStatementAccepted?: boolean,
  warning?: string,
  hint?: string,
  isAvailableInCountry?: string => boolean,
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
    isAvailableInCountry: isUK,
  },
  benefit_letters: {
    hint: 'benefits_letter_hint',
    icon: 'icon-letter',
    isAvailableInCountry: isUK,
  },
  government_letter: {
    hint: 'government_letter_hint',
    icon: 'icon-letter',
    isAvailableInCountry: isNonUK,
  },
}

export const poaDocumentTypes: string[] = Object.keys(poaDocumentOptions)

export const getDocumentTypeGroup = (documentType: string): GroupType  =>
  findKey({
    'proof_of_address': idDocumentTypes,
    'identity': poaDocumentTypes,
  }, types => includes(types, documentType))
