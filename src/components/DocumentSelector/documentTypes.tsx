import { findKey } from '~utils/object'
import { DocumentTypes, PoaTypes } from '~types/steps'
import { poaDocumentOptions } from '../ProofOfAddress/PoADocumentSelect'
import { idDocumentOptions } from '../Select/IdentityDocumentSelector'

export type GroupType = 'identity' | 'proof_of_address'

export type DocumentOptionsType = {
  type: DocumentTypes & PoaTypes
  icon: string
  label: string
  detail?: string
  warning?: string
  eStatements?: string
  checkAvailableInCountry?: (county: string) => boolean
}

export type DocumentTypeConfiguration = {
  labelKey: string
  detailKey?: string
  eStatementsKey?: string
  warningKey?: string
  icon?: string
  checkAvailableInCountry?: (country: string) => boolean
}

export type DocumentOptions =
  | Record<DocumentTypes, DocumentTypeConfiguration>
  | Record<PoaTypes, DocumentTypeConfiguration>

export const idDocumentTypes = Object.keys(idDocumentOptions)
export const poaDocumentTypes = Object.keys(poaDocumentOptions)

export const getDocumentTypeGroup = (documentType: string): GroupType =>
  findKey(
    {
      proof_of_address: poaDocumentTypes,
      identity: idDocumentTypes,
    },
    (types) => types.includes(documentType)
  )
