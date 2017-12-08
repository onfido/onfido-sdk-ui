import { uploadDesktop, uploadMobile } from './'
import { isDesktop } from '../utils'

export const uploadCopy = (method, documentType, side, i18n) => {
  let copy = {}
  const copyHash = isDesktop ? uploadDesktop(i18n) : uploadMobile(i18n)
  if (method === 'face') {
    copy = copyHash.face
  }
  else if (documentType) {
    copy = copyHash[documentType][side]
  }
  copy = { ...copyHash.common, ...copy }
  return copy
}
