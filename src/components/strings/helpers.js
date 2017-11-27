import { uploadDesktop, uploadMobile } from './'
import { isDesktop } from '../utils'

export const uploadCopy = (method, documentType, side) => {
  let copy = {}
  const copyHash = isDesktop ? uploadDesktop : uploadMobile
  if (method === 'face') {
    copy = copyHash.face
  }
  else if (documentType) {
    copy = copyHash[documentType][side]
  }
  return copy
}
