import { findKey } from '~utils/object'
import { poaDocumentOptions } from './PoADocumentSelector'
import { idDocumentOptions } from '.'

export type GroupType = 'identity' | 'proof_of_address'

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
