import { findKey } from '~utils/object'
import { isOfMimeType } from '~utils/blob'

const defaultFileTypesAccepted = ['jpg', 'jpeg', 'png', 'pdf']
const maxFileSizeAcceptedByAPI = 10000000 // The Onfido API only accepts files below 10 MB
export const validateFileTypeAndSize = (
  file,
  acceptedTypes = defaultFileTypesAccepted
) =>
  findKey(
    {
      INVALID_TYPE: (file) => !isOfMimeType(acceptedTypes, file),
      INVALID_SIZE: (file) => file.size > maxFileSizeAcceptedByAPI,
    },
    (checkFn) => checkFn(file)
  )
