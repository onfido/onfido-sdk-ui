import { isDesktop } from '../utils'

export const uploadCopy = (method, documentType, side) => {
  let copy = isDesktop ? 'upload_desktop' : 'upload_mobile'
  if (method === 'face') {
    copy = `${copy}.face`
  }
  else if (documentType) {
    copy = `${copy}.${documentType}.${side}`
  }
  return copy
}
